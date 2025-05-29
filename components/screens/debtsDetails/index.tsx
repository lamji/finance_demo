import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { formatPHPCurrency } from "@/helper";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { usePay } from "@/services/mutation/usePay";
import { Debt, useGetUser } from "@/services/query/usegetUser";
import { setEditingDebt } from "@/store/features/debtSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Overdue" },
  { key: "incoming", label: "Incoming Due" },
];

const DebtsDetailsScreen = ({ id }: { id: string }) => {
  const { data: user } = useGetUser();
  const { headerBgColors, theme, tintColor } = useHeaderTheme();
  const debt = user?.data?.debtsList?.find((debt) => debt._id === id) as
    | Debt
    | undefined;

  const [processingPaymentIndex, setProcessingPaymentIndex] = useState<
    number | null
  >(null);
  const [filter, setFilter] = useState<string>("all");
  const { mutate: makePayment } = usePay();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleEdit = () => {
    if (!debt) {
      return;
    }
    dispatch(
      setEditingDebt({
        id: debt._id,
        type: "for_update",
        ...debt, // Include the full debt data for editing
      }),
    );
    router.push({
      pathname: "/debts/add",
      params: { id: debt._id, edit: "true" },
    });
  };

  const calculatePercentage = () => {
    const total = Number(debt?.totalDebt);
    const paid = Number(debt?.total_paid) || 0;
    return Math.min(Math.round((paid / total) * 100), 100);
  };

  // Filter logic for payments
  const filteredPayments =
    debt?.monthly_payments?.filter((payment) => {
      const isPaid = payment.status === "paid";
      const isOverdue =
        payment.due_date && new Date(payment.due_date) < new Date() && !isPaid;
      const isPending = payment.status === "pending" && !isOverdue;
      const isIncoming =
        payment.status === "pending" &&
        payment.due_date &&
        new Date(payment.due_date) > new Date() &&
        (new Date(payment.due_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24) <=
          7; // due within 7 days

      if (filter === "all") return true;
      if (filter === "paid") return isPaid;
      if (filter === "pending") return isPending;
      if (filter === "overdue") return isOverdue;
      if (filter === "incoming") return isIncoming;
      return true;
    }) ?? [];

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        <View
          style={[styles.mainCard, { backgroundColor: headerBgColors[theme] }]}
        >
          <View style={styles.bankInfo}>
            <View style={styles.bankNameSection}>
              <View style={styles.iconContainer}>
                <IconSymbol name="creditcard.fill" size={24} color="#fff" />
              </View>
              <ThemedText style={styles.bankName}>{debt?.bank}</ThemedText>
            </View>
            <TouchableOpacity
              onPress={handleEdit}
              activeOpacity={0.7}
              style={{
                padding: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="square.and.pencil" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.amountContainer}>
            <ThemedText style={styles.amountLabel}>Total Debt</ThemedText>
            <ThemedText style={styles.amount}>
              {formatPHPCurrency(debt?.totalDebt)}
            </ThemedText>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculatePercentage()}%` },
                ]}
              />
            </View>
            <View style={styles.progressInfo}>
              <ThemedText style={styles.progressText}>
                {calculatePercentage()}% Completed
              </ThemedText>
              <ThemedText style={styles.remainingText}>
                {formatPHPCurrency(debt?.remaining_balance)} remaining
              </ThemedText>
            </View>
          </View>
          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statsItem}>
              <ThemedText style={styles.statsLabel}>Monthly Due</ThemedText>
              <ThemedText style={styles.statsValue}>
                {formatPHPCurrency(debt?.monthly_due)}
              </ThemedText>
            </View>
            <View style={styles.statsItem}>
              <ThemedText style={styles.statsLabel}>Total Paid</ThemedText>
              <ThemedText style={styles.statsValue}>
                {formatPHPCurrency(debt?.total_paid)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          {/* Creative Filter Bar */}
          <View style={styles.filterBarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterBar}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.filterButton,
                    filter === f.key && { backgroundColor: tintColor }, // Replace activeFilterButton style
                  ]}
                  onPress={() => setFilter(f.key)}
                >
                  <IconSymbol
                    name={
                      f.key === "all"
                        ? "list.bullet"
                        : f.key === "paid"
                          ? "checkmark.circle"
                          : f.key === "pending"
                            ? "clock"
                            : f.key === "overdue"
                              ? "exclamationmark.circle"
                              : "calendar"
                    }
                    size={16}
                    color={filter === f.key ? "#fff" : "#666"}
                  />
                  <ThemedText
                    style={[
                      styles.filterButtonText,
                      filter === f.key && styles.activeFilterButtonText,
                    ]}
                  >
                    {f.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Only one section for all payments */}
          <View style={styles.contentCard}>
            {filteredPayments.length ? (
              filteredPayments.map((payment, index) => {
                const isPaid = payment.status === "paid";
                const isOverdue =
                  payment.due_date &&
                  new Date(payment.due_date) < new Date() &&
                  !isPaid;
                return (
                  <View key={index} style={styles.paymentRow}>
                    <View style={styles.paymentInfo}>
                      <ThemedText style={styles.paymentAmount}>
                        {formatPHPCurrency(payment.amount)}
                      </ThemedText>
                      <ThemedText style={styles.paymentDate}>
                        {payment.due_date &&
                          new Date(payment.due_date).toLocaleDateString()}
                      </ThemedText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          isPaid
                            ? { backgroundColor: "#fff" }
                            : isOverdue
                              ? styles.overdueBadge
                              : styles.pendingBadge,
                        ]}
                      >
                        <IconSymbol
                          name={
                            isPaid
                              ? "checkmark.circle.fill"
                              : isOverdue
                                ? "exclamationmark.circle.fill"
                                : "clock.fill"
                          }
                          size={16}
                          color={
                            isPaid
                              ? headerBgColors[theme] // Use the card color for paid icon
                              : isOverdue
                                ? "#DC2626"
                                : "#FFA000"
                          }
                        />
                        <ThemedText
                          style={[
                            styles.statusText,
                            isPaid
                              ? { color: headerBgColors[theme] } // Use the card color for paid label
                              : isOverdue
                                ? styles.overdueText
                                : styles.pendingText,
                          ]}
                        >
                          {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
                        </ThemedText>
                      </View>
                      {!isPaid && (
                        <TouchableOpacity
                          style={[styles.payButton]}
                          onPress={() => {
                            if (!debt || !debt._id) return;
                            setProcessingPaymentIndex(index);
                            makePayment(
                              {
                                debtId: debt._id,
                                paymentIndex: index,
                              },
                              {
                                onSuccess: () => {
                                  setProcessingPaymentIndex(null);
                                },
                                onError: () => {
                                  setProcessingPaymentIndex(null);
                                },
                              },
                            );
                          }}
                        >
                          <IconSymbol
                            name="creditcard.fill"
                            size={16}
                            color={tintColor}
                          />
                          <ThemedText
                            style={[styles.payButtonText, { color: tintColor }]}
                          >
                            {processingPaymentIndex === index
                              ? "Processing"
                              : "Pay"}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyText}>
                <ThemedText>No payments available</ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterBarContainer: {
    height: 56,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    minWidth: 100,
    maxWidth: 150,
    height: 40,
  },
  activeFilterButton: {
    backgroundColor: "#2196F3",
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  mainCard: {
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    paddingTop: 15,
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bankNameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  bankName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  amount: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: "#fff",
  },
  progressSection: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  remainingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statsItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 16,
  },
  statsLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginBottom: 4,
  },
  statsValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  contentCard: {
    flex: 1, // Add this to make it fill available space
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    minHeight: 200, // Add minimum height for empty state
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
  },
  overdueBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2196F3",
  },
  pendingText: {
    color: "#FFA000",
  },
  overdueText: {
    color: "#DC2626",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 24,
    flex: 1, // Add this
    justifyContent: "center", // Add this
    alignItems: "center", // Add this
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  payButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
});

export default DebtsDetailsScreen;
