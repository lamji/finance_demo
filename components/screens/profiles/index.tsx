import { BackupSettingsModal } from "@/components/BackupSettingsModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import useViewModel, { MenuItem } from "./useViewModel";

function MenuListItem({ item }: { item: MenuItem }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol
          name={item.icon}
          size={24}
          color={item.color ?? "#666"}
          style={styles.menuIcon}
        />
        <ThemedText
          style={[styles.menuTitle, item.color ? { color: item.color } : null]}
        >
          {item.title}
        </ThemedText>
      </View>
      <View style={styles.menuItemRight}>
        {item.badge ? (
          <View style={styles.menuBadge}>
            <ThemedText style={styles.menuBadgeText}>{item.badge}</ThemedText>
          </View>
        ) : (
          <IconSymbol name="chevron.right" size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );
}

function AccountTypeCard({
  type,
  features,
  onUpgrade,
  handleBackup,
  handleDowngrade,
  tintColor,
}: {
  type: string;
  features: {
    maxRecords: number;
    storage: string;
    cloudBackup: boolean;
    price: string | null;
  };
  onUpgrade?: () => void;
  handleBackup?: () => void;
  handleDowngrade?: () => void;
  tintColor: string;
}) {
  const isGuest = type === "guest";
  const isOneTime = type === "one-time";
  const isMonthly = type === "monthly";

  return (
    <ThemedView style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View>
          <ThemedText style={styles.accountType}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Account
          </ThemedText>
          {features.price && (
            <ThemedText style={styles.accountPrice}>
              {features.price}
            </ThemedText>
          )}
        </View>
        <View style={styles.actionButtons}>
          {(isGuest || isOneTime) && onUpgrade && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: tintColor }]}
              onPress={onUpgrade}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="arrow.up.circle.fill"
                size={16}
                color="#FFFFFF"
                style={styles.actionButtonIcon}
              />
              <ThemedText style={styles.actionButtonText}>
                {isGuest ? "Upgrade" : "Go Monthly"}
              </ThemedText>
            </TouchableOpacity>
          )}
          {isMonthly && (
            <>
              {handleDowngrade && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
                  onPress={handleDowngrade}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name="arrow.down.circle.fill"
                    size={16}
                    color="#FFFFFF"
                    style={styles.actionButtonIcon}
                  />
                  <ThemedText style={styles.actionButtonText}>
                    Downgrade
                  </ThemedText>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <IconSymbol
            name={isGuest ? "xmark.circle.fill" : "checkmark.circle.fill"}
            size={20}
            color={isGuest ? "#FF3B30" : "#34C759"}
          />
          <ThemedText style={styles.featureText}>
            {isGuest ? "Limited to 20 records" : "Unlimited records"}
          </ThemedText>
        </View>
        <View style={styles.featureItem}>
          <IconSymbol
            name={isGuest ? "person.2.fill" : "person.fill"}
            size={20}
            color={isGuest ? "#FF9500" : "#34C759"}
          />
          <ThemedText style={styles.featureText}>
            {isGuest ? "Shared Account" : "Personal Account"}
          </ThemedText>
        </View>
        <View style={styles.featureItem}>
          <IconSymbol
            name={features.cloudBackup ? "icloud.fill" : "icloud.slash.fill"}
            size={20}
            color={
              features.cloudBackup
                ? "#34C759"
                : isOneTime
                  ? "#FF9500"
                  : "#FF3B30"
            }
          />
          <ThemedText style={styles.featureText}>
            {features.cloudBackup
              ? "Cloud Backup"
              : isOneTime
                ? "Local Storage Only"
                : "No Backup"}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

export default function ProfileScreen() {
  const {
    user,
    menuItems,
    tintColor,
    accountType,
    accountFeatures,
    modalVisible,
    setModalVisible,
    frequency,
    handleUpgrade,
    handleBackup,
    handleDowngrade,
    setFrequency,
    handleOpenBackup,
  } = useViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <IconSymbol
              name="person.crop.circle.fill"
              size={80}
              color={tintColor}
            />
          </View>
          <ThemedText style={styles.name}>{user?.name}</ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
        </View>
        {/* Account Type Section */}
        <AccountTypeCard
          type={accountType}
          features={accountFeatures}
          onUpgrade={handleUpgrade}
          handleBackup={handleBackup}
          handleDowngrade={handleDowngrade}
          tintColor={tintColor}
        />
        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <MenuListItem item={item} />
              {index < menuItems.length - 1 && (
                <View style={styles.menuDivider} />
              )}
            </React.Fragment>
          ))}
        </View>
        {/* Version Info */}
        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
        </View>
      </ScrollView>
      <BackupSettingsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        isMonthlySubscriber={true} // or false, depending on user
        selectedFrequency={frequency}
        onFrequencySelect={setFrequency}
        onBackupNow={handleOpenBackup}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
  menuSection: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.4,
  },
  accountCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  accountType: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  accountPrice: {
    fontSize: 14,
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  actionButtonIcon: {
    marginRight: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
  },
});
