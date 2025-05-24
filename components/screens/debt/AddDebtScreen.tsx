/** @format */

import { BottomSheetCalendar } from "@/components/BottomSheetCalendar";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { addDebt } from "@/store/features/debtSlice";
import { useAppDispatch } from "@/store/hooks";
import { nanoid } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

type TermType = "months" | "years";

interface DebtFormValues {
  bank: string;
  totalDebt: string;
  monthlyPayment: string;
  term: string;
  termType: TermType;
  startDate: Date;
  dueDate: Date;
}

const validationSchema = Yup.object().shape({
  bank: Yup.string()
    .required("Bank/Institution is required")
    .min(2, "Bank name must be at least 2 characters"),
  totalDebt: Yup.string()
    .required("Total debt is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Must be a valid amount"),
  monthlyPayment: Yup.string()
    .required("Monthly payment is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Must be a valid amount")
    .test(
      "is-less-than-total",
      "Monthly payment must be less than total debt",
      function (value) {
        const total = parseFloat(this.parent.totalDebt);
        return !value || !total || parseFloat(value) < total;
      }
    ),
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

export default function AddDebtScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() ?? "light";
  const { safeAreaBackground, theme } = useHeaderTheme();
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showDueDateCalendar, setShowDueDateCalendar] = useState(false);

  const initialValues: DebtFormValues = {
    bank: "",
    totalDebt: "",
    monthlyPayment: "",
    term: "",
    termType: "months",
    startDate: new Date(),
    dueDate: new Date(),
  };

  const handleSubmit = (values: DebtFormValues) => {
    dispatch(
      addDebt({
        id: nanoid(),
        ...values,
        startDate: values.startDate.toISOString(),
        dueDate: values.dueDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    router.back();
  };

  return (
    <>
      <StatusBar
        backgroundColor={safeAreaBackground}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Formik<DebtFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
        }) => (
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
          >
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Bank/Institution</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor:
                          errors.bank && touched.bank
                            ? "red"
                            : Colors[colorScheme].text,
                        color: Colors[colorScheme].text,
                      },
                    ]}
                    value={values.bank}
                    onChangeText={handleChange("bank")}
                    onBlur={() => setFieldTouched("bank")}
                    placeholder="Enter bank or institution name"
                    placeholderTextColor={Colors[colorScheme].text + "80"}
                  />
                  {errors.bank && touched.bank && (
                    <ThemedText style={styles.errorText}>
                      {errors.bank}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Total Debt</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor:
                          errors.totalDebt && touched.totalDebt
                            ? "red"
                            : Colors[colorScheme].text,
                        color: Colors[colorScheme].text,
                      },
                    ]}
                    value={values.totalDebt}
                    onChangeText={handleChange("totalDebt")}
                    onBlur={() => setFieldTouched("totalDebt")}
                    placeholder="Enter total debt amount"
                    keyboardType="numeric"
                    placeholderTextColor={Colors[colorScheme].text + "80"}
                  />
                  {errors.totalDebt && touched.totalDebt && (
                    <ThemedText style={styles.errorText}>
                      {errors.totalDebt}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Monthly Payment</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor:
                          errors.monthlyPayment && touched.monthlyPayment
                            ? "red"
                            : Colors[colorScheme].text,
                        color: Colors[colorScheme].text,
                      },
                    ]}
                    value={values.monthlyPayment}
                    onChangeText={handleChange("monthlyPayment")}
                    onBlur={() => setFieldTouched("monthlyPayment")}
                    placeholder="Enter monthly payment amount"
                    keyboardType="numeric"
                    placeholderTextColor={Colors[colorScheme].text + "80"}
                  />
                  {errors.monthlyPayment && touched.monthlyPayment && (
                    <ThemedText style={styles.errorText}>
                      {errors.monthlyPayment}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Term</ThemedText>
                  <View style={styles.termContainer}>
                    <TextInput
                      style={[
                        styles.termInput,
                        {
                          borderColor:
                            errors.term && touched.term
                              ? "red"
                              : Colors[colorScheme].text,
                          color: Colors[colorScheme].text,
                        },
                      ]}
                      value={values.term}
                      onChangeText={handleChange("term")}
                      onBlur={() => setFieldTouched("term")}
                      placeholder="Enter term"
                      keyboardType="numeric"
                      placeholderTextColor={Colors[colorScheme].text + "80"}
                    />
                    <View style={styles.termTypeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.termTypeButton,
                          {
                            backgroundColor:
                              values.termType === "months"
                                ? Colors[colorScheme].tint
                                : "transparent",
                          },
                          { borderColor: Colors[colorScheme].text },
                        ]}                        onPress={() => setFieldValue("termType", "months")}
                      >
                        <ThemedText
                          style={[
                            styles.termTypeText,
                            {
                              color:
                                values.termType === "months"
                                  ? "#fff"
                                  : Colors[colorScheme].text,
                            },
                          ]}
                        >Months</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.termTypeButton,
                          {
                            backgroundColor:
                              values.termType === "years"
                                ? Colors[colorScheme].tint
                                : "transparent",
                          },
                          { borderColor: Colors[colorScheme].text },
                        ]}                        onPress={() => setFieldValue("termType", "years")}
                      >
                        <ThemedText
                          style={[
                            styles.termTypeText,
                            {
                              color:
                                values.termType === "years"
                                  ? "#fff"
                                  : Colors[colorScheme].text,
                            },
                          ]}
                        >Years</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {errors.term && touched.term && (
                    <ThemedText style={styles.errorText}>{errors.term}</ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Start Date</ThemedText>
                  <TouchableOpacity
                    onPress={() => setShowStartDateCalendar(true)}
                    style={[
                      styles.dateButton,
                      {
                        borderColor:
                          errors.startDate && touched.startDate
                            ? "red"
                            : Colors[colorScheme].text,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="calendar"
                      size={20}
                      color={Colors[colorScheme].text}
                      style={styles.calendarIcon}
                    />
                    <ThemedText
                      style={[
                        styles.dateText,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      {format(values.startDate, "MMMM d, yyyy")}
                    </ThemedText>
                  </TouchableOpacity>
                  {errors.startDate && touched.startDate && (
                    <ThemedText style={styles.errorText}>
                      {String(errors.startDate)}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Due Date</ThemedText>
                  <TouchableOpacity
                    onPress={() => setShowDueDateCalendar(true)}
                    style={[
                      styles.dateButton,
                      {
                        borderColor:
                          errors.dueDate && touched.dueDate
                            ? "red"
                            : Colors[colorScheme].text,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="calendar"
                      size={20}
                      color={Colors[colorScheme].text}
                      style={styles.calendarIcon}
                    />
                    <ThemedText
                      style={[
                        styles.dateText,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      {format(values.dueDate, "MMMM d, yyyy")}
                    </ThemedText>
                  </TouchableOpacity>
                  {errors.dueDate && touched.dueDate && (
                    <ThemedText style={styles.errorText}>
                      {String(errors.dueDate)}
                    </ThemedText>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: Colors[colorScheme].tint },
                ]}
                onPress={() => handleSubmit()}
              >
                <ThemedText style={styles.submitButtonText}>Add Debt</ThemedText>
              </TouchableOpacity>
            </View>
            <BottomSheetCalendar
              isVisible={showStartDateCalendar}
              onClose={() => setShowStartDateCalendar(false)}
              selectedDate={values.startDate}
              onDateSelect={(date) => {
                setFieldValue("startDate", date);
                setShowStartDateCalendar(false);
              }}
              minDate={new Date()}
              version="v2"
            />
            <BottomSheetCalendar
              isVisible={showDueDateCalendar}
              onClose={() => setShowDueDateCalendar(false)}
              selectedDate={values.dueDate}
              onDateSelect={(date) => {
                setFieldValue("dueDate", date);
                setShowDueDateCalendar(false);
              }}
              minDate={values.startDate}
              version="v2"
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
  },
  calendarIcon: {
    marginRight: 8,
  },
  termContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  termInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  termTypeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  termTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  termTypeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
