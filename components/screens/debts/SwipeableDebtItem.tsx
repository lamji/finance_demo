import { IconSymbol } from "@/components/ui/IconSymbol";
import { format } from "date-fns";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { SwipeableRow } from "@/components/SwipeableRow";
import { ThemedText } from "@/components/ThemedText";
import { formatPHPCurrency } from "@/helper";

interface SwipeableDebtItemProps {
  debt: any;
  onDelete: (id: string) => void;
  tintColor: string;
  calculateProgress: (debt: any) => number;
  isClosedDebt?: boolean;
}

export function SwipeableDebtItem({
  debt,
  onDelete,
  tintColor,
  calculateProgress,
  isClosedDebt = false,
}: SwipeableDebtItemProps) {
  const containerStyle = {
    ...styles.debtItem,
    borderBottomColor: tintColor + "20",
  };
  const handlePress = () => {
    router.push({ pathname: "/debts/[id]", params: { id: debt._id } });
  };

  return (
    <SwipeableRow
      id={debt._id}
      containerStyle={containerStyle}
      onDelete={() => onDelete(debt._id)}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.contentContainer}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: tintColor + "20" },
              ]}
            >
              <IconSymbol name="creditcard.fill" size={24} color={tintColor} />
            </View>
            <View>
              <ThemedText style={[styles.bankName, { color: tintColor }]}>
                {debt.bank}
              </ThemedText>
              <ThemedText style={[styles.dueDate, { color: tintColor + "99" }]}>
                Due {format(new Date(debt?.due_date), "MMM d")}
              </ThemedText>
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <ThemedText style={[styles.amount, { color: tintColor }]}>
              {formatPHPCurrency(debt.totalDebt)}
            </ThemedText>
            {/* Progress Section */}
            <View style={styles.progressWrapper}>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: tintColor + "20" },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: tintColor,
                        width: `${calculateProgress(debt)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <ThemedText
                style={[styles.progressText, { color: tintColor + "99" }]}
              >
                {calculateProgress(debt)}% completed
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  debtItem: {
    marginVertical: 4,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
    minWidth: 120,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 13,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressWrapper: {
    width: "100%",
    alignItems: "flex-end",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
  },
  closedDebtItem: {
    opacity: 0.7,
  },
});
