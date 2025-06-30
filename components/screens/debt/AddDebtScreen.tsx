/** @format */

import { BottomSheetCalendar } from "@/components/BottomSheetCalendar";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { formatCurrencyForDisplay } from "@/helper";
import { format } from "date-fns";
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
import useViewModel from "./useViewModel";

export default function AddDebtScreen() {
  const vm = useViewModel();

  const formik = vm.formik;

  const renderLoanFields = () => (
    <>
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Bank/Institution</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                formik.errors.bank && formik.touched.bank
                  ? "red"
                  : Colors[vm.colorScheme].text,
              color: Colors[vm.colorScheme].text,
            },
          ]}
          value={formik.values.bank}
          onChangeText={formik.handleChange("bank")}
          onBlur={formik.handleBlur("bank")}
          placeholder="Enter bank or institution name"
          placeholderTextColor={Colors[vm.colorScheme].text + "80"}
        />
        {formik.errors.bank && formik.touched.bank && (
          <ThemedText style={styles.errorText}>{formik.errors.bank}</ThemedText>
        )}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Total Debt</ThemedText>
        <View
          style={[
            styles.currencyInputContainer,
            {
              borderColor:
                formik.errors.totalDebt && formik.touched.totalDebt
                  ? "red"
                  : Colors[vm.colorScheme].text,
            },
          ]}
        >
          <ThemedText style={styles.currencySymbol}>₱</ThemedText>
          <TextInput
            style={[
              styles.currencyInput,
              { color: Colors[vm.colorScheme].text },
            ]}
            value={formatCurrencyForDisplay(formik.values.totalDebt)}
            onChangeText={(text) =>
              vm.handleCurrencyChange("totalDebt", text, formik.setFieldValue)
            }
            onBlur={formik.handleBlur("totalDebt")}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={Colors[vm.colorScheme].text + "80"}
          />
        </View>
        {formik.errors.totalDebt && formik.touched.totalDebt && (
          <ThemedText style={styles.errorText}>
            {formik.errors.totalDebt}
          </ThemedText>
        )}
      </View>

      {/* Monthly Payment Field */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Monthly Payment</ThemedText>
        <View
          style={[
            styles.currencyInputContainer,
            {
              borderColor:
                formik.errors.monthlyPayment && formik.touched.monthlyPayment
                  ? "red"
                  : Colors[vm.colorScheme].text,
            },
          ]}
        >
          <ThemedText style={styles.currencySymbol}>₱</ThemedText>
          <TextInput
            style={[
              styles.currencyInput,
              { color: Colors[vm.colorScheme].text },
            ]}
            value={formatCurrencyForDisplay(formik.values.monthlyPayment)}
            onChangeText={(text) =>
              vm.handleCurrencyChange(
                "monthlyPayment",
                text,
                formik.setFieldValue,
              )
            }
            onBlur={formik.handleBlur("monthlyPayment")}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={Colors[vm.colorScheme].text + "80"}
          />
        </View>
        {formik.errors.monthlyPayment && formik.touched.monthlyPayment && (
          <ThemedText style={styles.errorText}>
            {formik.errors.monthlyPayment}
          </ThemedText>
        )}
      </View>

      {/* Term Fields */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Term</ThemedText>
        <View style={styles.termContainer}>
          <TextInput
            style={[
              styles.termInput,
              {
                borderColor:
                  formik.errors.term && formik.touched.term
                    ? "red"
                    : Colors[vm.colorScheme].text,
                color: Colors[vm.colorScheme].text,
              },
            ]}
            value={formik.values.term}
            onChangeText={formik.handleChange("term")}
            onBlur={formik.handleBlur("term")}
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
                    formik.values.termType === "months"
                      ? Colors[vm.colorScheme].tint
                      : "transparent",
                  borderColor: Colors[vm.colorScheme].text,
                },
              ]}
              onPress={() => formik.setFieldValue("termType", "months")}
            >
              <ThemedText
                style={[
                  styles.termTypeText,
                  {
                    color:
                      formik.values.termType === "months"
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
                    formik.values.termType === "years"
                      ? Colors[vm.colorScheme].tint
                      : "transparent",
                  borderColor: Colors[vm.colorScheme].text,
                },
              ]}
              onPress={() => formik.setFieldValue("termType", "years")}
            >
              <ThemedText
                style={[
                  styles.termTypeText,
                  {
                    color:
                      formik.values.termType === "years"
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
        {formik.errors.term && formik.touched.term && (
          <ThemedText style={styles.errorText}>{formik.errors.term}</ThemedText>
        )}
      </View>

      {/* Date Fields */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Start Date</ThemedText>
        <TouchableOpacity
          onPress={() => vm.setShowStartDateCalendar(true)}
          style={[
            styles.dateButton,
            {
              borderColor:
                formik.errors.startDate && formik.touched.startDate
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
            style={[styles.dateText, { color: Colors[vm.colorScheme].text }]}
          >
            {formik.values.startDate
              ? format(formik.values.startDate, "MMMM d, yyyy")
              : "Select date"}
          </ThemedText>
        </TouchableOpacity>
        {formik.errors.startDate && formik.touched.startDate && (
          <ThemedText style={styles.errorText}>
            {String(formik.errors.startDate)}
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
                formik.errors.dueDate && formik.touched.dueDate
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
            style={[styles.dateText, { color: Colors[vm.colorScheme].text }]}
          >
            {formik.values.dueDate
              ? format(formik.values.dueDate, "MMMM d, yyyy")
              : "Select date"}
          </ThemedText>
        </TouchableOpacity>
        {formik.errors.dueDate && formik.touched.dueDate && (
          <ThemedText style={styles.errorText}>
            {String(formik.errors.dueDate)}
          </ThemedText>
        )}
      </View>
    </>
  );
  const renderCreditCardFields = () => (
    <>
      {/* Bank Field */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Bank/Institution</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                formik.errors.bank && formik.touched.bank
                  ? "red"
                  : Colors[vm.colorScheme].text,
              color: Colors[vm.colorScheme].text,
            },
          ]}
          value={formik.values.bank}
          onChangeText={formik.handleChange("bank")}
          onBlur={formik.handleBlur("bank")}
          placeholder="Enter bank name"
          placeholderTextColor={Colors[vm.colorScheme].text + "80"}
        />
        {formik.errors.bank && formik.touched.bank && (
          <ThemedText style={styles.errorText}>{formik.errors.bank}</ThemedText>
        )}
      </View>

      {/* Payment Type Selection */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Payment Type</ThemedText>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              {
                backgroundColor:
                  formik.values.paymentType === "full"
                    ? Colors[vm.colorScheme].tint
                    : "transparent",
                borderColor: Colors[vm.colorScheme].text,
              },
            ]}
            onPress={() => formik.setFieldValue("paymentType", "full")}
          >
            <IconSymbol
              name="checkmark.circle"
              size={20}
              color={
                formik.values.paymentType === "full"
                  ? "#fff"
                  : Colors[vm.colorScheme].text
              }
              style={styles.typeIcon}
            />
            <ThemedText
              style={[
                styles.typeText,
                {
                  color:
                    formik.values.paymentType === "full"
                      ? "#fff"
                      : Colors[vm.colorScheme].text,
                },
              ]}
            >
              Full Payment
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              {
                backgroundColor:
                  formik.values.paymentType === "installment"
                    ? Colors[vm.colorScheme].tint
                    : "transparent",
                borderColor: Colors[vm.colorScheme].text,
              },
            ]}
            onPress={() => formik.setFieldValue("paymentType", "installment")}
          >
            <IconSymbol
              name="banknote"
              size={20}
              color={
                formik.values.paymentType === "installment"
                  ? "#fff"
                  : Colors[vm.colorScheme].text
              }
              style={styles.typeIcon}
            />
            <ThemedText
              style={[
                styles.typeText,
                {
                  color:
                    formik.values.paymentType === "installment"
                      ? "#fff"
                      : Colors[vm.colorScheme].text,
                },
              ]}
            >
              Installment
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional Fields Based on Payment Type */}
      {formik.values.paymentType === "full" ? (
        <>
          {/* Monthly Due Amount */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Monthly Due Amount</ThemedText>
            <View
              style={[
                styles.currencyInputContainer,
                {
                  borderColor:
                    formik.errors.monthlyPayment &&
                    formik.touched.monthlyPayment
                      ? "red"
                      : Colors[vm.colorScheme].text,
                },
              ]}
            >
              <ThemedText style={styles.currencySymbol}>₱</ThemedText>
              <TextInput
                style={[
                  styles.currencyInput,
                  { color: Colors[vm.colorScheme].text },
                ]}
                value={formatCurrencyForDisplay(formik.values.monthlyPayment)}
                onChangeText={(text) =>
                  vm.handleCurrencyChange(
                    "monthlyPayment",
                    text,
                    formik.setFieldValue,
                  )
                }
                onBlur={formik.handleBlur("monthlyPayment")}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={Colors[vm.colorScheme].text + "80"}
              />
            </View>
            {formik.errors.monthlyPayment && formik.touched.monthlyPayment && (
              <ThemedText style={styles.errorText}>
                {formik.errors.monthlyPayment}
              </ThemedText>
            )}
          </View>
        </>
      ) : (
        <>
          {/* Total Purchase Amount */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Total Purchase Amount</ThemedText>
            <View
              style={[
                styles.currencyInputContainer,
                {
                  borderColor:
                    formik.errors.totalDebt && formik.touched.totalDebt
                      ? "red"
                      : Colors[vm.colorScheme].text,
                },
              ]}
            >
              <ThemedText style={styles.currencySymbol}>₱</ThemedText>
              <TextInput
                style={[
                  styles.currencyInput,
                  { color: Colors[vm.colorScheme].text },
                ]}
                value={formatCurrencyForDisplay(formik.values.totalDebt)}
                onChangeText={(text) =>
                  vm.handleCurrencyChange(
                    "totalDebt",
                    text,
                    formik.setFieldValue,
                  )
                }
                onBlur={formik.handleBlur("totalDebt")}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={Colors[vm.colorScheme].text + "80"}
              />
            </View>
            {formik.errors.totalDebt && formik.touched.totalDebt && (
              <ThemedText style={styles.errorText}>
                {formik.errors.totalDebt}
              </ThemedText>
            )}
          </View>

          {/* Number of Installments */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Number of Installments</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor:
                    formik.errors.term && formik.touched.term
                      ? "red"
                      : Colors[vm.colorScheme].text,
                  color: Colors[vm.colorScheme].text,
                },
              ]}
              value={formik.values.term}
              onChangeText={formik.handleChange("term")}
              onBlur={formik.handleBlur("term")}
              placeholder="Enter number of months"
              keyboardType="numeric"
              placeholderTextColor={Colors[vm.colorScheme].text + "80"}
            />
            {formik.errors.term && formik.touched.term && (
              <ThemedText style={styles.errorText}>
                {formik.errors.term}
              </ThemedText>
            )}
          </View>

          {/* Auto Calculate Toggle */}
          <View style={styles.inputGroup}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: formik.values.isAutoCalculated
                      ? Colors[vm.colorScheme].tint
                      : "transparent",
                    borderColor: Colors[vm.colorScheme].text,
                  },
                ]}
                onPress={() => {
                  formik.setFieldValue(
                    "isAutoCalculated",
                    !formik.values.isAutoCalculated,
                  );
                }}
              >
                {formik.values.isAutoCalculated && (
                  <IconSymbol name="checkmark.circle" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <ThemedText style={styles.checkboxLabel}>
                Auto-calculate monthly installment
              </ThemedText>
            </View>
          </View>

          {/* Monthly Installment Amount (Calculated) */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Monthly Installment</ThemedText>
            <View
              style={[
                styles.currencyInputContainer,
                { opacity: formik.values.isAutoCalculated ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={styles.currencySymbol}>₱</ThemedText>
              {formik.values.isAutoCalculated ? (
                <ThemedText
                  style={[
                    styles.currencyInput,
                    { color: Colors[vm.colorScheme].text },
                  ]}
                >
                  {formatCurrencyForDisplay(
                    String(
                      Number(formik.values.totalDebt || 0) /
                        Number(formik.values.term || 1),
                    ),
                  )}
                </ThemedText>
              ) : (
                <TextInput
                  style={[
                    styles.currencyInput,
                    { color: Colors[vm.colorScheme].text },
                  ]}
                  value={formatCurrencyForDisplay(formik.values.monthlyPayment)}
                  onChangeText={(text) =>
                    vm.handleCurrencyChange(
                      "monthlyPayment",
                      text,
                      formik.setFieldValue,
                    )
                  }
                  onBlur={formik.handleBlur("monthlyPayment")}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={Colors[vm.colorScheme].text + "80"}
                  editable={!formik.values.isAutoCalculated}
                />
              )}
            </View>
            {!formik.values.isAutoCalculated &&
              formik.errors.monthlyPayment &&
              formik.touched.monthlyPayment && (
                <ThemedText style={styles.errorText}>
                  {formik.errors.monthlyPayment}
                </ThemedText>
              )}
          </View>
        </>
      )}

      {/* Due Date Field */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Due Date</ThemedText>
        <TouchableOpacity
          onPress={() => vm.setShowDueDateCalendar(true)}
          style={[
            styles.dateButton,
            {
              borderColor:
                formik.errors.dueDate && formik.touched.dueDate
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
            style={[styles.dateText, { color: Colors[vm.colorScheme].text }]}
          >
            {formik.values.dueDate
              ? format(formik.values.dueDate, "MMMM d, yyyy")
              : "Select date"}
          </ThemedText>
        </TouchableOpacity>
        {formik.errors.dueDate && formik.touched.dueDate && (
          <ThemedText style={styles.errorText}>
            {String(formik.errors.dueDate)}
          </ThemedText>
        )}
      </View>
    </>
  );

  return (
    <>
      <StatusBar
        backgroundColor={vm.safeAreaBackground}
        barStyle={vm.theme === "dark" ? "light-content" : "dark-content"}
      />
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
            {/* Debt Type Selection */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Debt Type</ThemedText>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        formik.values.type === "loan"
                          ? Colors[vm.colorScheme].tint
                          : "transparent",
                      borderColor: Colors[vm.colorScheme].text,
                    },
                  ]}
                  onPress={() => formik.setFieldValue("type", "loan")}
                >
                  <IconSymbol
                    name="doc.text.fill"
                    size={20}
                    color={
                      formik.values.type === "loan"
                        ? "#fff"
                        : Colors[vm.colorScheme].text
                    }
                    style={styles.typeIcon}
                  />
                  <ThemedText
                    style={[
                      styles.typeText,
                      {
                        color:
                          formik.values.type === "loan"
                            ? "#fff"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    Loan
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        formik.values.type === "credit_card"
                          ? Colors[vm.colorScheme].tint
                          : "transparent",
                      borderColor: Colors[vm.colorScheme].text,
                    },
                  ]}
                  onPress={() => formik.setFieldValue("type", "credit_card")}
                >
                  <IconSymbol
                    name="creditcard.fill"
                    size={20}
                    color={
                      formik.values.type === "credit_card"
                        ? "#fff"
                        : Colors[vm.colorScheme].text
                    }
                    style={styles.typeIcon}
                  />
                  <ThemedText
                    style={[
                      styles.typeText,
                      {
                        color:
                          formik.values.type === "credit_card"
                            ? "#fff"
                            : Colors[vm.colorScheme].text,
                      },
                    ]}
                  >
                    Credit Card
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Conditional Rendering of Form Fields */}
            {formik.values.type === "loan"
              ? renderLoanFields()
              : renderCreditCardFields()}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: Colors[vm.colorScheme].tint,
              },
            ]}
            onPress={() => formik.handleSubmit()}
            // disabled={formik.values.type === "credit_card"}
          >
            {vm.addDebtStatus?.isLoading || vm.updateDebtStatus?.isLoading ? (
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
          selectedDate={formik.values.startDate ?? new Date()}
          onDateSelect={(date) => {
            formik.setFieldValue("startDate", date);
          }}
          minDate={new Date()}
          version="v2"
        />
        <BottomSheetCalendar
          isVisible={vm.showDueDateCalendar}
          onClose={() => vm.setShowDueDateCalendar(false)}
          selectedDate={formik.values.dueDate ?? new Date()}
          onDateSelect={(date) => {
            formik.setFieldValue("dueDate", date);
          }}
          minDate={formik.values.startDate ?? undefined}
          version="v2"
        />
      </KeyboardAvoidingView>
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
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  typeIcon: {
    marginRight: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
