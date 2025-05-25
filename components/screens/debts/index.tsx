/** @format */

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { deleteDebt } from "@/store/features/debtSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { SwipeableDebtItem } from "./SwipeableDebtItem";

export default function DebtManagerScreen() {
  const { safeAreaBackground } = useHeaderTheme();
  const theme = useColorScheme() ?? "light";
  const tintColor = Colors[theme].tint;
  const dispatch = useAppDispatch();
  const debts = useAppSelector((state) => state.debt.debts);
  // Animation states
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseValue] = useState(new Animated.Value(1)); // Handle animations and loading
  useEffect(() => {
    // Loading animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      pulseAnimation.stop();

      // Start entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 0);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, pulseValue]);

  // Calculate progress percentage based on paid amount vs total debt
  const calculateProgress = (debt: any) => {
    const totalDebt = Number(debt.totalDebt);
    if (debt.total_paid !== undefined && totalDebt > 0) {
      const progress = (Number(debt.total_paid) / totalDebt) * 100;
      return Math.min(Math.round(progress), 100);
    }
    return 0;
  };

  const openLoans = debts.filter((debt) => Number(debt.remaining_balance) > 0);
  const closedLoans = debts.filter(
    (debt) => Number(debt.remaining_balance) === 0,
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={safeAreaBackground}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: safeAreaBackground }]}
      >
        <Animated.View
          style={[
            { flex: 1 },
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <View style={styles.cardsContainer}>
                <ThemedView
                  style={[
                    styles.card,
                    {
                      backgroundColor: "#4CAF50",
                      borderColor: "#388E3C",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardIconBackground,
                      { backgroundColor: "#388E3C" },
                    ]}
                  />
                  <ThemedText style={[styles.cardLabel, { color: "#E8F5E9" }]}>
                    Active Loans
                  </ThemedText>
                  <ThemedText style={[styles.cardValue, { color: "white" }]}>
                    {openLoans.length}
                  </ThemedText>
                  <View style={styles.cardDetails}>
                    <ThemedText
                      style={[styles.cardCaption, { color: "#E8F5E9" }]}
                    >
                      Ongoing
                    </ThemedText>
                  </View>
                  <IconSymbol
                    name="creditcard.fill"
                    size={32}
                    color="white"
                    style={styles.cardIcon}
                  />
                </ThemedView>
                <ThemedView
                  style={[
                    styles.card,
                    {
                      backgroundColor: "#9E9E9E",
                      borderColor: "#757575",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardIconBackground,
                      { backgroundColor: "#757575" },
                    ]}
                  />
                  <ThemedText style={[styles.cardLabel, { color: "#F5F5F5" }]}>
                    Closed Loans
                  </ThemedText>
                  <ThemedText style={[styles.cardValue, { color: "white" }]}>
                    {closedLoans.length}
                  </ThemedText>
                  <View style={styles.cardDetails}>
                    <ThemedText
                      style={[styles.cardCaption, { color: "#F5F5F5" }]}
                    >
                      Paid off
                    </ThemedText>
                  </View>
                  <IconSymbol
                    name="checkmark.seal.fill"
                    size={32}
                    color="white"
                    style={styles.cardIcon}
                  />
                </ThemedView>
              </View>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <ThemedText type="subtitle" style={{ color: "white" }}>
                      Active Debts
                    </ThemedText>
                    <ThemedText style={styles.sectionSubtitle}>
                      Your current loan obligations
                    </ThemedText>
                  </View>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.addButton, { backgroundColor: tintColor }]}
                      onPress={() => router.push("/debts/add")}
                    >
                      <IconSymbol
                        name="plus.circle.fill"
                        size={20}
                        color="#fff"
                      />
                      <ThemedText style={styles.addButtonText}>
                        Add Debt
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.sectionListing}>
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
                    <ActivityIndicator size="large" color={tintColor} />
                  </Animated.View>
                  <ThemedText style={styles.loadingText}>
                    Loading debts...
                  </ThemedText>
                </View>
              ) : openLoans.length > 0 ? (
                <View style={styles.debtsList}>
                  {openLoans.map((debt) => (
                    <SwipeableDebtItem
                      key={debt.id}
                      debt={debt}
                      onDelete={(id) => dispatch(deleteDebt(id))}
                      tintColor={tintColor}
                      calculateProgress={calculateProgress}
                    />
                  ))}
                </View>
              ) : (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={styles.emptyStateText}>
                    No active debts
                  </ThemedText>
                  <ThemedText style={styles.emptyStateSubtext}>
                    Add your first debt to start tracking
                  </ThemedText>
                </ThemedView>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 32,
  },
  cardsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 180,
    position: "relative",
    overflow: "hidden",
  },
  cardIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    opacity: 0.8,
  },
  cardIconBackground: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.07,
  },
  cardLabel: {
    fontSize: 12,

    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 36,
    marginTop: 18,
  },
  cardDetails: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  cardCaption: {
    fontSize: 10,
    letterSpacing: 0.8,
    opacity: 0.6,
    textTransform: "uppercase",
    marginTop: 4,
  },
  sectionListing: {
    minHeight: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
    color: Colors.light.white,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 4,
  },
  debtsList: {
    gap: 12,
  },
  debtItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    alignSelf: "flex-end",
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
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  deleteAction: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingContent: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  loadingIcons: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
  },
});
