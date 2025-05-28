/** @format */

import { BottomSheetCalendar } from "@/components/BottomSheetCalendar";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { formatCurrencyForDisplay } from "@/helper";
import { format } from "date-fns";
import { Formik } from "formik";
import React from "react";
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
import useViewModel, { validationSchema } from "./useViewModel";

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

export default function AddDebtScreen() {
  const vm = useViewModel();

  return (
    <>
      <StatusBar
        backgroundColor={vm.safeAreaBackground}
        barStyle={vm.theme === "dark" ? "light-content" : "dark-content"}
      />
      <Formik<DebtFormValues>
        initialValues={vm.initialValues}
        validationSchema={validationSchema}
        onSubmit={vm.handleSubmit}
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
                            : Colors[vm.colorScheme].text,
                        color: Colors[vm.colorScheme].text,
                      },
                    ]}
                    value={values.bank}
                    onChangeText={handleChange("bank")}
                    onBlur={() => setFieldTouched("bank")}
                    placeholder="Enter bank or institution name"
                    placeholderTextColor={Colors[vm.colorScheme].text + "80"}
                  />
                  {errors.bank && touched.bank && (
                    <ThemedText style={styles.errorText}>
                      {errors.bank}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Total Debt</ThemedText>
                  <View
                    style={[
                      styles.currencyInputContainer,
                      {
                        borderColor:
                          errors.totalDebt && touched.totalDebt
                            ? "red"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    <ThemedText style={styles.currencySymbol}>₱</ThemedText>
                    <TextInput
                      style={[
                        styles.currencyInput,
                        {
                          color: Colors[vm.colorScheme].text,
                        },
                      ]}
                      value={formatCurrencyForDisplay(values.totalDebt)}
                      onChangeText={(text) =>
                        vm.handleCurrencyChange(
                          "totalDebt",
                          text,
                          setFieldValue,
                        )
                      }
                      onBlur={() => setFieldTouched("totalDebt")}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor={Colors[vm.colorScheme].text + "80"}
                    />
                  </View>
                  {errors.totalDebt && touched.totalDebt && (
                    <ThemedText style={styles.errorText}>
                      {errors.totalDebt}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Monthly Payment</ThemedText>
                  <View
                    style={[
                      styles.currencyInputContainer,
                      {
                        borderColor:
                          errors.monthlyPayment && touched.monthlyPayment
                            ? "red"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    <ThemedText style={styles.currencySymbol}>₱</ThemedText>
                    <TextInput
                      style={[
                        styles.currencyInput,
                        {
                          color: Colors[vm.colorScheme].text,
                        },
                      ]}
                      value={formatCurrencyForDisplay(values.monthlyPayment)}
                      onChangeText={(text) =>
                        vm.handleCurrencyChange(
                          "monthlyPayment",
                          text,
                          setFieldValue,
                        )
                      }
                      onBlur={() => setFieldTouched("monthlyPayment")}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor={Colors[vm.colorScheme].text + "80"}
                    />
                  </View>
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
                              : Colors[vm.colorScheme].text,
                          color: Colors[vm.colorScheme].text,
                        },
                      ]}
                      value={values.term}
                      onChangeText={handleChange("term")}
                      onBlur={() => setFieldTouched("term")}
                      placeholder="Enter term"
                      keyboardType="numeric"
                      placeholderTextColor={Colors[vm.colorScheme].text + "80"}
                    />
                    <View style={styles.termTypeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.termTypeButton,
                          {
                            backgroundColor:
                              values.termType === "months"
                                ? Colors[vm.colorScheme].tint
                                : "transparent",
                          },
                          { borderColor: Colors[vm.colorScheme].text },
                        ]}
                        onPress={() => setFieldValue("termType", "months")}
                      >
                        <ThemedText
                          style={[
                            styles.termTypeText,
                            {
                              color:
                                values.termType === "months"
                                  ? "#fff"
                                  : Colors[vm.colorScheme].text,
                            },
                          ]}
                        >
                          Months
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.termTypeButton,
                          {
                            backgroundColor:
                              values.termType === "years"
                                ? Colors[vm.colorScheme].tint
                                : "transparent",
                          },
                          { borderColor: Colors[vm.colorScheme].text },
                        ]}
                        onPress={() => setFieldValue("termType", "years")}
                      >
                        <ThemedText
                          style={[
                            styles.termTypeText,
                            {
                              color:
                                values.termType === "years"
                                  ? "#fff"
                                  : Colors[vm.colorScheme].text,
                            },
                          ]}
                        >
                          Years
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {errors.term && touched.term && (
                    <ThemedText style={styles.errorText}>
                      {errors.term}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Start Date</ThemedText>
                  <TouchableOpacity
                    onPress={() => vm.setShowStartDateCalendar(true)}
                    style={[
                      styles.dateButton,
                      {
                        borderColor:
                          errors.startDate && touched.startDate
                            ? "red"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="calendar"
                      size={20}
                      color={Colors[vm.colorScheme].text}
                      style={styles.calendarIcon}
                    />
                    <ThemedText
                      style={[
                        styles.dateText,
                        { color: Colors[vm.colorScheme].text },
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
                    onPress={() => vm.setShowDueDateCalendar(true)}
                    style={[
                      styles.dateButton,
                      {
                        borderColor:
                          errors.dueDate && touched.dueDate
                            ? "red"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    <IconSymbol
                      name="calendar"
                      size={20}
                      color={Colors[vm.colorScheme].text}
                      style={styles.calendarIcon}
                    />
                    <ThemedText
                      style={[
                        styles.dateText,
                        { color: Colors[vm.colorScheme].text },
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
                  { backgroundColor: Colors[vm.colorScheme].tint },
                ]}
                onPress={() => handleSubmit()}
              >
                {vm.addDebtStatus?.isLoading ||
                vm.updateDebtStatus?.isLoading ? (
                  <ThemedText style={styles.submitButtonText}>
                    {vm.isEditMode
                      ? vm.updateDebtStatus?.isLoading
                        ? "Updating..."
                        : "Update Debt"
                      : vm.addDebtStatus?.isLoading
                        ? "Adding..."
                        : "Add Debt"}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.submitButtonText}>
                    {vm.isEditMode ? "Update Debt" : "Add Debt"}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
            <BottomSheetCalendar
              isVisible={vm.showStartDateCalendar}
              onClose={() => vm.setShowStartDateCalendar(false)}
              selectedDate={values.startDate}
              onDateSelect={(date) => {
                setFieldValue("startDate", date);
                vm.setShowStartDateCalendar(false);
              }}
              minDate={new Date()}
              version="v2"
            />
            <BottomSheetCalendar
              isVisible={vm.showDueDateCalendar}
              onClose={() => vm.setShowDueDateCalendar(false)}
              selectedDate={values.dueDate}
              onDateSelect={(date) => {
                setFieldValue("dueDate", date);
                vm.setShowDueDateCalendar(false);
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
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: "500",
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    paddingLeft: 0,
    borderWidth: 0,
  },
});
