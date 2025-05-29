import { useColorScheme } from "@/hooks/useColorScheme";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { useAddDebt } from "@/services/mutation/useAddDebts";
import { useUpdateDebt } from "@/services/mutation/useUpdateDebt";
import { clearEditingDebt } from "@/store/features/debtSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export type TermType = "months" | "years";

export interface DebtFormValues {
  bank: string;
  totalDebt: string;
  monthlyPayment: string;
  term: string;
  termType: TermType;
  startDate: Date;
  dueDate: Date;
}

// Add this interface at the top with other interfaces
interface EditingDebt {
  id: string;
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
  bank: Yup.string()
    .required("Bank/Institution is required")
    .min(2, "Bank name must be at least 2 characters"),
  totalDebt: Yup.string()
    .required("Total debt is required")
    .test("is-positive", "Amount must be greater than 0", function (value) {
      const numValue = parseFloat(value || "0");
      return numValue > 0;
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
    .required("Start date is required")
    .typeError("Invalid date"),
  dueDate: Yup.date()
    .required("Due date is required")
    .min(Yup.ref("startDate"), "Due date must be after start date")
    .typeError("Invalid date"),
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
      }
    : {
        bank: "",
        totalDebt: "",
        monthlyPayment: "",
        term: "10",
        termType: "months",
        startDate: new Date(),
        dueDate: new Date(),
      };

  const addDebtMutation = useAddDebt();
  const updateDebtMutation = useUpdateDebt();

  // Combine loading states from both mutations
  const isLoading = addDebtMutation.isPending || updateDebtMutation.isPending;
  const isError = addDebtMutation.isError || updateDebtMutation.isError;
  const error = addDebtMutation.error || updateDebtMutation.error;

  const handleSubmit = async (values: DebtFormValues) => {
    try {
      if (isEditMode && editingDebt) {
        await updateDebtMutation.mutateAsync({
          debtId: editingDebt.id,
          bank: values.bank,
          totalDebt: Number(values.totalDebt),
          monthlyPayment: values.monthlyPayment,
          term_length: Number(values.term),
          term_type: values.termType,
          start_date: values.startDate.toISOString().split("T")[0],
          due_date: values.dueDate.toISOString().split("T")[0],
        });
      } else {
        await addDebtMutation.mutateAsync({
          bank: values.bank,
          totalDebt: Number(values.totalDebt),
          monthlyPayment: values.monthlyPayment,
          term_length: Number(values.term),
          term_type: values.termType,
          start_date: values.startDate.toISOString().split("T")[0],
          due_date: values.dueDate.toISOString().split("T")[0],
        });
      }
      router.back();
    } catch (error) {
      // Error handling is done by the mutation hooks
      console.error("Operation failed:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearEditingDebt());
    };
  }, [dispatch]);

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
  };
}
