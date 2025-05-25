import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  SafeAreaView,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ACCOUNT_FEATURES } from "@/helper/acountFeatures";
import useViewModel, { PaymentHistoryItem } from "./useViewModel";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PaymentScreen() {
  const {
    userType,
    nextPayment,
    paymentHistory,
    purchaseDetails,
    onUpgradePress,
    headerConfig,
  } = useViewModel();
  const tintColor = useThemeColor({}, "tint");

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={styles.container}
          lightColor="transparent"
          darkColor="transparent"
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText
                style={{ color: "black", fontSize: 20, fontWeight: "600" }}
              >
                Your Subscription Details
              </ThemedText>
            </View>
          </View>
          {renderSubscriptionInfo()}
          {userType === "monthly" && paymentHistory.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.sectionHeader}>
                <View>
                  <ThemedText style={styles.sectionTitle}>
                    Payment History
                  </ThemedText>
                  <ThemedText style={styles.sectionSubtitle}>
                    Your previous payments
                  </ThemedText>
                </View>
              </View>
              <View style={styles.historyListContainer}>
                <FlatList
                  data={paymentHistory}
                  renderItem={renderPaymentHistoryItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.historyList}
                />
              </View>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );

  function renderSubscriptionInfo() {
    switch (userType) {
      case "guest":
        const guestFeatures = ACCOUNT_FEATURES["guest"];
        return (
          <View style={[styles.section, { backgroundColor: tintColor }]}>
            <View style={styles.subscriptionHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFF3E0" }]}
              >
                <IconSymbol
                  name="person.crop.circle.badge.questionmark"
                  size={30}
                  color="#F57C00"
                />
              </View>
              <View style={styles.headerTextContainer}>
                <ThemedText
                  style={[styles.subscriptionTitle, { color: "white" }]}
                >
                  Guest Account
                </ThemedText>
                <ThemedText style={[styles.pricingText, { color: "white" }]}>
                  {guestFeatures.price}
                </ThemedText>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureRow}>
                <IconSymbol name="list.bullet" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  Up to {guestFeatures.maxRecords} records
                </ThemedText>
              </View>
              <View style={styles.featureRow}>
                <IconSymbol name="icloud.slash" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  {guestFeatures.storage} storage only
                </ThemedText>
              </View>
              <View style={styles.featureRow}>
                <IconSymbol name="xmark.circle.fill" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  No cloud backup
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                { backgroundColor: headerConfig.backgroundColor.light },
              ]}
              onPress={onUpgradePress}
            >
              <View style={styles.buttonContent}>
                <IconSymbol name="bolt.fill" size={20} color="#FFF" />
                <ThemedText style={styles.upgradeButtonText}>
                  Upgrade to Premium
                </ThemedText>
              </View>
              <ThemedText style={styles.buttonPrice}>
                Starting at {ACCOUNT_FEATURES["one-time"].price}
              </ThemedText>
            </TouchableOpacity>
          </View>
        );

      case "one-time":
        const oneTimeFeatures = ACCOUNT_FEATURES["one-time"];
        return (
          <View style={[styles.section, { backgroundColor: tintColor }]}>
            <View style={styles.subscriptionHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E3F2FD" }]}
              >
                <IconSymbol name="creditcard.fill" size={30} color="#1976D2" />
              </View>
              <View style={styles.headerTextContainer}>
                <ThemedText
                  style={[styles.subscriptionTitle, { color: "white" }]}
                >
                  One-Time License
                </ThemedText>
                <View style={styles.priceContainer}>
                  <ThemedText style={[styles.pricingText, { color: "white" }]}>
                    {oneTimeFeatures.price}
                  </ThemedText>
                  <ThemedText
                    style={[styles.pricingSubtext, { color: "white" }]}
                  >
                    Lifetime access
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureRow}>
                <IconSymbol name="infinity" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  Unlimited records
                </ThemedText>
              </View>
              <View style={styles.featureRow}>
                <IconSymbol name="iphone" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  {oneTimeFeatures.storage} storage
                </ThemedText>
              </View>
              {!oneTimeFeatures.cloudBackup && (
                <View style={styles.featureRow}>
                  <IconSymbol
                    name="xmark.circle.fill"
                    size={20}
                    color="white"
                  />
                  <ThemedText style={[styles.featureText, { color: "white" }]}>
                    No cloud features
                  </ThemedText>
                </View>
              )}
            </View>

            {purchaseDetails && (
              <View style={styles.purchaseInfo}>
                <View style={styles.purchaseHeader}>
                  <IconSymbol name="bag.fill" size={20} color="#1976D2" />
                  <ThemedText style={styles.purchaseTitle}>
                    Purchase Details
                  </ThemedText>
                </View>
                <View style={styles.purchaseDetails}>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailsCol}>
                      <ThemedText style={styles.detailLabel}>
                        Purchase Date
                      </ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {purchaseDetails.date}
                      </ThemedText>
                    </View>
                    <View style={styles.detailsCol}>
                      <ThemedText style={styles.detailLabel}>
                        Amount Paid
                      </ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {purchaseDetails.amount}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailsCol}>
                      <ThemedText style={styles.detailLabel}>
                        Payment Method
                      </ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {purchaseDetails.paymentMethod}
                      </ThemedText>
                    </View>
                    <View style={styles.detailsCol}>
                      <ThemedText style={styles.detailLabel}>
                        Reference No
                      </ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {purchaseDetails.referenceNo}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case "monthly":
        const monthlyFeatures = ACCOUNT_FEATURES["monthly"];
        return (
          <View style={[styles.section, { backgroundColor: tintColor }]}>
            <View style={styles.subscriptionHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
              >
                <IconSymbol name="crown.fill" size={30} color="#2E7D32" />
              </View>
              <View style={styles.headerTextContainer}>
                <View style={styles.titleRow}>
                  <ThemedText
                    style={[styles.subscriptionTitle, { color: "white" }]}
                  >
                    Premium Plan
                  </ThemedText>
                  <View style={[styles.badge, { backgroundColor: "#333" }]}>
                    <ThemedText style={styles.badgeText}>BEST VALUE</ThemedText>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <ThemedText style={[styles.pricingText, { color: "white" }]}>
                    {monthlyFeatures.price}
                  </ThemedText>
                  <ThemedText
                    style={[styles.pricingSubtext, { color: "white" }]}
                  >
                    Billed monthly
                  </ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureRow}>
                <IconSymbol name="infinity" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  {monthlyFeatures.maxRecords === Infinity
                    ? "Unlimited"
                    : monthlyFeatures.maxRecords}{" "}
                  records
                </ThemedText>
              </View>
              <View style={styles.featureRow}>
                <IconSymbol name="folder.fill" size={20} color="white" />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  {monthlyFeatures.storage} storage
                </ThemedText>
              </View>
              <View style={styles.featureRow}>
                <IconSymbol
                  name={
                    monthlyFeatures.cloudBackup ? "icloud.fill" : "icloud.slash"
                  }
                  size={20}
                  color="white"
                />
                <ThemedText style={[styles.featureText, { color: "white" }]}>
                  {monthlyFeatures.cloudBackup
                    ? "Cloud backup enabled"
                    : "No cloud backup"}
                </ThemedText>
              </View>
            </View>
            {nextPayment && (
              <View style={styles.nextPaymentCard}>
                <IconSymbol
                  name="calendar.badge.clock"
                  size={24}
                  color="#2E7D32"
                />
                <View style={styles.nextPaymentInfo}>
                  <ThemedText style={styles.nextPaymentDate}>
                    {nextPayment.date}
                  </ThemedText>
                  <ThemedText style={styles.nextPaymentLabel}>
                    Next payment
                  </ThemedText>
                </View>
                <View style={styles.nextPaymentAmount}>
                  <ThemedText style={styles.amountText}>
                    {monthlyFeatures.price}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
        );
    }
  }

  function renderPaymentHistoryItem({ item }: { item: PaymentHistoryItem }) {
    return (
      <View style={styles.historyItem}>
        <IconSymbol
          name={item.status === "paid" ? "checkmark.circle.fill" : "clock.fill"}
          size={24}
          color={item.status === "paid" ? "#4CAF50" : "#FFA500"}
          style={styles.historyIcon}
        />
        <View style={styles.historyContent}>
          <View style={styles.historyMain}>
            <ThemedText style={styles.historyTitle}>
              Subscription Payment
            </ThemedText>
            <ThemedText style={styles.historyAmount}>{item.amount}</ThemedText>
          </View>
          <View style={styles.historyDetails}>
            <ThemedText style={styles.historyDate}>{item.date}</ThemedText>
            <View style={styles.referenceContainer}>
              <ThemedText style={styles.referenceText}>
                #{item.referenceNo}
              </ThemedText>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      item.status === "paid" ? "#E8F5E9" : "#FFF3E0",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: item.status === "paid" ? "#2E7D32" : "#F57C00" },
                  ]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 20,
  },
  scrollViewContent: {
    paddingBottom: Platform.OS === "ios" ? 80 : 80,
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  historySection: {
    marginHorizontal: -16,
  },
  historyListContainer: {
    backgroundColor: "white",
  },
  historyList: {
    paddingTop: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  upgradeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: "#F57C00",
    fontSize: 14,
  },
  benefitsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    gap: 8,
  },
  benefitsText: {
    flex: 1,
    color: "#2E7D32",
    fontSize: 14,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  historyIcon: {
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    fontSize: 13,
    color: "#666",
  },
  referenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  referenceText: {
    fontSize: 13,
    color: "#666",
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  subscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  premiumHeader: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(46,125,50,0.05)",
    marginHorizontal: -16,
    marginTop: -16,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  pricingText: {
    fontSize: 20,
    fontWeight: "700",
  },
  pricingSubtext: {
    fontSize: 12,
    opacity: 0.6,
  },
  priceContainer: {
    marginTop: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    marginBottom: 8,
    borderRadius: 8,
  },
  featuredFeature: {
    backgroundColor: "rgba(46,125,50,0.05)",
  },
  disabledFeature: {
    backgroundColor: "rgba(255,59,48,0.05)",
  },
  featureText: {
    flex: 1,
    fontSize: 15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPrice: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  nextPaymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  nextPaymentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nextPaymentDate: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextPaymentLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
  },
  transactionCard: {
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 16,
    overflow: "hidden",
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionGrid: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  transactionCol: {
    width: "50%",
    marginBottom: 16,
  },
  transactionLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailsCol: {
    width: "50%",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 16,
  },
});
