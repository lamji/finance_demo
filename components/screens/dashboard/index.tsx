/** @format */

import { router } from "expo-router";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { formatPHPCurrency } from "@/helper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { logout } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import useViewModel, {
  ActivityItem as ActivityItemType,
  ScheduleItem as ScheduleItemType,
} from "./useViewModel";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const {
    tintColor,
    walletStats,
    recentActivity,
    scheduleItems,
    headerConfig,
  } = useViewModel();

  const handleLogoutPress = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  // Calculate progress percentage for debt payment
  const calculateProgressPercentage = () => {
    const totalDebt = walletStats.totalDebt;
    const paid = walletStats.paid;

    if (totalDebt === 0) return 0;

    const percentage = (paid / totalDebt) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };

  const progressPercentage = calculateProgressPercentage();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: headerConfig.safeAreaBackground },
      ]}
    >
      <ScrollView bounces={false}>
        <View
          style={[
            styles.header,
            { backgroundColor: headerConfig.safeAreaBackground },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <ThemedText style={styles.welcomeText}>
                  Welcome back,
                </ThemedText>
                <ThemedText type="title" style={styles.headerTitle}>
                  {headerConfig.userName}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={handleLogoutPress}
                style={styles.avatarButton}
              >
                <View>
                  <IconSymbol
                    name="person.crop.circle.fill"
                    size={40}
                    color="#fff"
                  />
                  <View style={styles.notificationBadge}>
                    <ThemedText style={styles.notificationCount}>3</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>

              {showLogoutMenu && (
                <TouchableOpacity
                  style={styles.menuOverlay}
                  onPress={() => setShowLogoutMenu(false)}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.logoutMenu,
                      { position: "absolute", top: 65, right: 20 },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.menuNotificationItem}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemContent}>
                        <IconSymbol
                          name="bell.fill"
                          size={20}
                          color={tintColor}
                        />
                        <ThemedText style={styles.menuItemText}>
                          Notifications
                        </ThemedText>
                      </View>
                      <View
                        style={[
                          styles.menuBadge,
                          { backgroundColor: "#FF3B30" },
                        ]}
                      >
                        <ThemedText style={styles.menuBadgeText}>3</ThemedText>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />

                    <TouchableOpacity
                      style={styles.logoutButton}
                      activeOpacity={0.7}
                      onPress={handleLogout}
                    >
                      <IconSymbol
                        name="rectangle.portrait.and.arrow.right"
                        size={20}
                        color="#FF3B30"
                      />
                      <ThemedText style={styles.logoutText}>Logout</ThemedText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <View>
                  <ThemedText style={styles.walletLabel}>Total Debt</ThemedText>
                  <ThemedText type="title" style={styles.walletAmount}>
                    {formatPHPCurrency(walletStats.totalDebt)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <ThemedText style={styles.progressLabel}>
                    Payment Progress
                  </ThemedText>
                  <ThemedText style={styles.progressPercentage}>
                    {progressPercentage.toFixed(1)}%
                  </ThemedText>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.progressLabels}>
                  <ThemedText style={styles.progressLabelText}>
                    Remaining:
                    {formatPHPCurrency(
                      walletStats.totalDebt - walletStats.paid,
                    )}
                  </ThemedText>
                  <ThemedText style={styles.progressLabelText}>
                    Paid: {formatPHPCurrency(walletStats.paid)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <ThemedText type="subtitle">Recent Activity</ThemedText>
                <ThemedText style={styles.sectionSubtitle}>
                  Your latest transactions
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.seeAllButton}>
                <ThemedText style={[styles.seeAllText, { color: tintColor }]}>
                  See All
                </ThemedText>
                <IconSymbol name="chevron.right" size={16} color={tintColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </View>
          </ThemedView>

          <Collapsible title="Payment Schedule">
            <View style={styles.scheduleList}>
              {scheduleItems.map((item, index) => (
                <ScheduleItem key={index} {...item} />
              ))}
            </View>
          </Collapsible>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityItem({
  title,
  description,
  amount,
  date,
  isPositive,
}: ActivityItemType) {
  const iconName = isPositive
    ? "arrow.down.left.circle.fill"
    : "arrow.up.right.circle.fill";
  const iconColor = isPositive ? "#4CAF50" : "#F44336";

  return (
    <ThemedView style={styles.activityItem}>
      <View style={styles.activityIconContainer}>
        <IconSymbol name={iconName} size={32} color={iconColor} />
      </View>
      <View style={styles.activityInfo}>
        <View style={styles.activityHeader}>
          <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
            {title}
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.amount,
              { color: isPositive ? "#4CAF50" : "#F44336" },
            ]}
          >
            {isPositive ? "+" : "-"}
            {amount}
          </ThemedText>
        </View>
        <ThemedText style={styles.activityDescription}>
          {description}
        </ThemedText>
        <ThemedText style={styles.dateText}>{date}</ThemedText>
      </View>
    </ThemedView>
  );
}

function ScheduleItem({ title, dueDate, amount, isPaid }: ScheduleItemType) {
  const theme = useColorScheme() ?? "light";
  const tintColor = Colors[theme].tint;

  return (
    <ThemedView style={styles.scheduleItem}>
      <View>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={styles.scheduleDate}>Due {dueDate}</ThemedText>
      </View>
      <View style={styles.scheduleRight}>
        <ThemedText type="defaultSemiBold">{amount}</ThemedText>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isPaid ? "#4CAF50" : tintColor,
            },
          ]}
        >
          <ThemedText style={styles.statusText}>
            {isPaid ? "Paid" : "Due"}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  walletLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 14,
  },
  walletAmount: {
    color: "#fff",
    fontSize: 32,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  walletStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 20,
  },
  walletStat: {
    alignItems: "center",
    gap: 4,
  },
  statAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 12,
  },
  section: {
    gap: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
    gap: 6,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  activityDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityDescription: {
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: -0.1,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.5,
    letterSpacing: -0.1,
  },
  scheduleList: {
    gap: 12,
    marginTop: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  scheduleDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  scheduleRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  avatarButton: {
    position: "relative",
  },
  logoutMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
    backgroundColor: "transparent",
  },
  menuNotificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  notificationCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  menuBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 2,
  },
  // Progress Bar Styles
  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  progressPercentage: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    minWidth: "2%", // Minimum width to show some progress
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  progressLabelText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
});
