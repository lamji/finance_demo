import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SwipeableRow } from '@/components/SwipeableRow';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
  isClosedDebt = false 
}: SwipeableDebtItemProps) {
  return (
    <SwipeableRow
      id={debt.id}
      containerStyle={styles.debtItem}
      onDelete={() => onDelete(debt.id)}
    >
      <ThemedView style={[styles.debtItemContent, isClosedDebt && styles.closedDebtItem]}>
        {isClosedDebt ? (
          <>
            <View style={styles.debtHeader}>
              <ThemedText type="defaultSemiBold">{debt.bank}</ThemedText>
              <View style={[styles.badge, { backgroundColor: "#4CAF50" }]}>
                <ThemedText style={styles.badgeText}>Paid</ThemedText>
              </View>
            </View>
            <View style={styles.debtDetails}>
              <ThemedText style={styles.detailText}>
                Total Paid: ${debt.totalDebt}
              </ThemedText>
              <ThemedText style={styles.detailText}>
                Closed: {format(new Date(debt.dueDate), "MMM d, yyyy")}
              </ThemedText>
            </View>
          </>
        ) : (
          <>
            <View style={styles.debtHeader}>
              <ThemedText type="defaultSemiBold">
                {debt.bank}
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ color: tintColor }}
              >
                ${debt.totalDebt}
              </ThemedText>
            </View>
            <View style={styles.debtDetails}>
              <ThemedText style={styles.detailText}>
                Monthly Payment: ${debt.monthlyPayment}
              </ThemedText>
              <ThemedText style={styles.detailText}>
                Due: {format(new Date(debt.dueDate), "MMM d, yyyy")}
              </ThemedText>
            </View>
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
              <ThemedText style={styles.progressText}>
                {calculateProgress(debt)}% paid
              </ThemedText>
            </View>
          </>
        )}
      </ThemedView>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  debtItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  debtItemContent: {
    padding: 16,
    gap: 8,
  },
  closedDebtItem: {
    opacity: 0.7,
  },
  debtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  debtDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.6,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});