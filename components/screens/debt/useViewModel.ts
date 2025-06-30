import { useColorScheme } from "@/hooks/useColorScheme";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { useAddDebt } from "@/services/mutation/useAddDebts";
import { useUpdateDebt } from "@/services/mutation/useUpdateDebt";
import { clearEditingDebt } from "@/store/features/debtSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export type TermType = "months" | "years";
export type DebtType = "loan" | "credit_card";
export type PaymentType = "full" | "installment";

export interface DebtFormValues {
  type: DebtType;
  bank: string;
  totalDebt: string;
  monthlyPayment: string;
  term: string;
  termType: TermType;
  startDate: Date | null; // Allow null for empty state
  dueDate: Date | null; // Allow null for empty state
  paymentType: PaymentType;
  isAutoCalculated?: boolean; // Add new field for auto calculation toggle
}

// Add this interface at the top with other interfaces
interface EditingDebt {
  id: string;
  type: DebtType;
  bank: string;
  totalDebt: string;
  monthly_due: string;
  term_length: string;
  term_type: TermType;
  start_date: string | Date;
  due_date: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["loan", "credit_card"] as const, "Invalid debt type")
    .required("Debt type is required"),
  bank: Yup.string()
    .required("Bank/Institution is required")
    .min(2, "Bank name must be at least 2 characters"),
  paymentType: Yup.string().when("type", {
    is: "credit_card",
    then: () =>
      Yup.string()
        .oneOf(["full", "installment"] as const, "Invalid payment type")
        .required("Payment type is required"),
  }),
  totalDebt: Yup.string().when(["type", "paymentType"], {
    is: (type: string, paymentType: string) =>
      type === "credit_card" && paymentType === "installment",
    then: () =>
      Yup.string()
        .required("Total purchase amount is required")
        .test("is-positive", "Amount must be greater than 0", function (value) {
          const numValue = parseFloat(value || "0");
          return numValue > 0;
        }),
  }),
  monthlyPayment: Yup.string()
    .required("Monthly payment is required")
    .test("is-positive", "Monthly payment must be positive", (value) => {
      if (!value) return true; // Let Yup handle required validation
      const num = Number(value.replace(/[^0-9.-]+/g, ""));
      return !isNaN(num) && num > 0;
    })
    .test("is-valid-number", "Please enter a valid number", (value) => {
      if (!value) return true; // Let Yup handle required validation
      const num = Number(value.replace(/[^0-9.-]+/g, ""));
      return !isNaN(num);
    })
    .test("sufficient-payment", function (value) {
      if (!value || !this.parent.totalDebt || !this.parent.term) return true;

      const monthlyPayment = Number(value.replace(/[^0-9.-]+/g, ""));
      const totalDebt = Number(this.parent.totalDebt.replace(/[^0-9.-]+/g, ""));
      const termLength = Number(this.parent.term);
      const isYears = this.parent.termType === "years";
      const numberOfMonths = isYears ? termLength * 12 : termLength;

      const totalPayments = monthlyPayment * numberOfMonths;

      if (totalPayments < totalDebt) {
        const minMonthlyPayment = Math.ceil(totalDebt / numberOfMonths);
        const minTermMonths = Math.ceil(totalDebt / monthlyPayment);
        const minTerm = isYears
          ? Math.ceil((minTermMonths / 12) * 10) / 10 // Round to 1 decimal place for years
          : minTermMonths;

        return this.createError({
          message:
            `Total payments (₱${totalPayments.toLocaleString()}) must be at least equal to total debt (₱${totalDebt.toLocaleString()}). ` +
            `Either increase monthly payment to at least ₱${minMonthlyPayment.toLocaleString()} ` +
            `or increase term to at least ${minTerm} ${isYears ? "years" : "months"}.`,
        });
      }

      return true;
    }),
  term: Yup.string()
    .required("Term is required")
    .matches(/^\d+$/, "Must be a number"),
  termType: Yup.string()
    .oneOf(["months", "years"], "Invalid term type")
    .required("Term type is required"),
  startDate: Yup.date()
    .nullable() // Allow null
    .required("Start date is required")
    .typeError("Invalid date"),
  dueDate: Yup.date()
    .nullable() // Allow null
    .required("Due date is required")
    .min(Yup.ref("startDate"), "Due date must be after start date")
    .typeError("Invalid date"),
});

// Shared monthly payment validation logic
const monthlyPaymentValidation = Yup.string()
  .required("Monthly payment is required")
  .test("is-positive", "Monthly payment must be positive", (value) => {
    if (!value) return true; // Let Yup handle required validation
    const num = Number(value.replace(/[^0-9.-]+/g, ""));
    return !isNaN(num) && num > 0;
  })
  .test("is-valid-number", "Please enter a valid number", (value) => {
    if (!value) return true;
    const num = Number(value.replace(/[^0-9.-]+/g, ""));
    return !isNaN(num);
  });

// Credit Card validation schema
export const creditCardValidationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["credit_card"] as const, "Invalid debt type")
    .required("Debt type is required"),
  bank: Yup.string()
    .required("Bank/Institution is required")
    .min(2, "Bank name must be at least 2 characters"),
  paymentType: Yup.string()
    .oneOf(["full", "installment"] as const, "Invalid payment type")
    .required("Payment type is required"),
  // For Full Payment
  monthlyPayment: monthlyPaymentValidation.when("paymentType", {
    is: "full",
    then: (schema) => schema.required("Monthly payment is required"),
  }),
  dueDate: Yup.date()
    .required("Due date is required")
    .min(new Date(), "Due date must be in the future")
    .typeError("Invalid date"),
  // For Installment
  totalDebt: Yup.string().when("paymentType", {
    is: "installment",
    then: (schema) =>
      schema
        .required("Total debt is required")
        .test("is-positive", "Amount must be greater than 0", (value) => {
          const numValue = parseFloat(value || "0");
          return numValue > 0;
        }),
  }),
  term: Yup.string().when("paymentType", {
    is: "installment",
    then: (schema) =>
      schema
        .required("Term is required")
        .matches(/^\d+$/, "Must be a number")
        .test("min-term", "Term must be at least 2 months", (value) => {
          return Number(value) >= 2;
        }),
  }),
});

export default function useViewModel() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() ?? "light";
  const { safeAreaBackground, theme } = useHeaderTheme();
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showDueDateCalendar, setShowDueDateCalendar] = useState(false);
  const { editingDebt } = useAppSelector((state) => state.debt) as {
    editingDebt: EditingDebt | null;
  };
  const [type, setType] = useState<DebtType>("loan");
  const isEditMode = !!editingDebt;

  const handleCurrencyChange = (
    field: string,
    value: string,
    setFieldValue: any,
  ) => {
    const cleanValue = value.replace(/[₱,\s]/g, "");
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      setFieldValue(field, cleanValue);
    }
  };

  // Update the initialValues section with proper date parsing
  const initialValues: DebtFormValues = editingDebt
    ? {
        type: editingDebt.type || "loan",
        bank: editingDebt.bank || "",
        totalDebt: editingDebt.totalDebt || "",
        monthlyPayment: editingDebt.monthly_due || "",
        term: String(editingDebt.term_length || "25"),
        termType: editingDebt.term_type || "months",
        startDate:
          editingDebt.start_date instanceof Date
            ? editingDebt.start_date
            : new Date(editingDebt.start_date || new Date()),
        dueDate:
          editingDebt.due_date instanceof Date
            ? editingDebt.due_date
            : new Date(editingDebt.due_date || new Date()),
        paymentType: "full",
        isAutoCalculated: true,
      }
    : {
        type: "loan",
        bank: "",
        totalDebt: "",
        monthlyPayment: "",
        term: "",
        termType: "months",
        startDate: null, // Changed to null
        dueDate: null, // Changed to null
        paymentType: "full",
        isAutoCalculated: true,
      };

  const addDebtMutation = useAddDebt();
  const updateDebtMutation = useUpdateDebt();

  // Combine loading states from both mutations
  const isLoading = addDebtMutation.isPending || updateDebtMutation.isPending;
  const isError = addDebtMutation.isError || updateDebtMutation.isError;
  const error = addDebtMutation.error || updateDebtMutation.error;

  const handleSubmit = async (values: DebtFormValues) => {
    try {
      const baseDebtData = {
        bank: values.bank,
        start_date: values.startDate
          ? values.startDate.toISOString().split("T")[0]
          : "",
        due_date: values.dueDate
          ? values.dueDate.toISOString().split("T")[0]
          : "",
      };

      if (values.type === "loan") {
        const loanData = {
          ...baseDebtData,
          type: "loan" as const,
          totalDebt: Number(values.totalDebt),
          monthlyPayment: values.monthlyPayment,
          term_length: Number(values.term),
          term_type: values.termType,
        };

        if (isEditMode && editingDebt) {
          await updateDebtMutation.mutateAsync({
            debtId: editingDebt.id,
            ...loanData,
          });
        } else {
          await addDebtMutation.mutateAsync(loanData);
        }
      } else if (values.type === "credit_card") {
        const creditCardData = {
          ...baseDebtData,
          type: "credit_card" as const,
          totalDebt:
            values.paymentType === "installment" ? Number(values.totalDebt) : 0,
          monthlyPayment:
            values.paymentType === "full"
              ? values.monthlyPayment
              : String(Number(values.totalDebt) / Number(values.term)),
          term_length:
            values.paymentType === "installment" ? Number(values.term) : 1,
          term_type: "months" as const,
          payment_type: values.paymentType,
        };

        if (isEditMode && editingDebt) {
          await updateDebtMutation.mutateAsync({
            debtId: editingDebt.id,
            ...creditCardData,
          });
        } else {
          await addDebtMutation.mutateAsync(creditCardData);
        }
      }

      router.back();
    } catch (error) {
      // Error handling is done by the mutation hooks
      console.error("Operation failed:", error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    return () => {
      dispatch(clearEditingDebt());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("Formik values changed:", formik.values);
    if (formik.values.type !== "loan") {
      // Perform any additional logic when form values change
      console.log("Current form values:", formik.values);
      setType(formik.values.type);
    }
  }, [formik.values]);

  return {
    colorScheme,
    safeAreaBackground,
    theme,
    showStartDateCalendar,
    setShowStartDateCalendar,
    showDueDateCalendar,
    setShowDueDateCalendar,
    isEditMode,
    handleCurrencyChange,
    initialValues,
    handleSubmit,
    validationSchema,
    isLoading,
    isError,
    error,
    // Optional: Return individual mutation states if needed
    addDebtStatus: {
      isLoading: addDebtMutation.isPending,
      isError: addDebtMutation.isError,
      error: addDebtMutation.error,
    },
    updateDebtStatus: {
      isLoading: updateDebtMutation.isPending,
      isError: updateDebtMutation.isError,
      error: updateDebtMutation.error,
    },
    formik,
  };
}
