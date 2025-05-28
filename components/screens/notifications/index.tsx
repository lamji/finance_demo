import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect } from "react";
import {
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useViewModel } from "./useViewModel";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "payment" | "reminder" | "system";
  isSelected?: boolean; // Added for selection
};

export default function NotificationScreen() {
  const router = useRouter();
  const vm = useViewModel();
  console.log("NotificationScreen rendered", vm);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(vm.fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(vm.slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [vm.fadeAnim, vm.slideAnim]);
  // No unused functions or comments here

  const renderNotificationItem = (
    notification: Notification,
    index: number,
    vm: ReturnType<typeof useViewModel>,
  ) => {
    return (
      <Animated.View
        key={notification.id}
        style={{
          opacity: vm.fadeAnim,
          transform: [
            {
              translateY: Animated.multiply(
                vm.slideAnim,
                new Animated.Value(index * 0.1 + 1), // Reduced multiplier for smoother cascade
              ),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.notificationItem,
            notification.isRead ? styles.readItem : styles.unreadItem,
            notification.isSelected && styles.selectedItem, // Style for selected item
          ]}
          onPress={() => vm.handleNotificationPress(notification.id)}
          onLongPress={() => vm.handleToggleSelect(notification.id)} // Long press to start selection
        >
          <View style={styles.leftColumn}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: `${vm.getIconColorForType(notification.type)}20`,
                },
              ]}
            >
              <IconSymbol
                name={vm.getIconForType(notification.type)}
                size={24}
                color={vm.getIconColorForType(notification.type)}
              />
            </View>
            <TouchableOpacity
              onPress={() => vm.handleToggleSelect(notification.id)}
              style={styles.radioButtonContainer}
            >
              <IconSymbol
                name={
                  notification.isSelected ? "checkmark.circle.fill" : "circle"
                }
                size={22}
                color={notification.isSelected ? "#2196F3" : "#BDBDBD"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.notificationTitle}>
                {notification.title}
              </ThemedText>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            <ThemedText style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </ThemedText>
            <ThemedText style={styles.timestamp}>
              {moment(notification.timestamp).format("MMM D, YYYY")}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* ... existing header top row (back button, title) ... */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {vm.selectedCount > 0
            ? `${vm.selectedCount} Selected`
            : "Notifications"}
        </ThemedText>
        {/* Placeholder for centering title if using space-between */}
        <View
          style={{
            // Ensure styles.backButton.padding is accessed safely if it could be undefined
            width: (styles.backButton?.padding || 8) * 2 + 24,
          }}
        />
      </View>

      <View style={styles.headerActions}>
        {/* 1. Select All / Deselect All Button */}
        {vm.notifications.length > 0 && (
          <TouchableOpacity
            onPress={vm.handleSelectAll} // This function is now correctly toggling
            style={styles.markAllButton}
          >
            <ThemedText style={styles.markAllText}>
              {/* This text logic should now work as expected */}
              {vm.notifications.length > 0 &&
              vm.notifications.every((n) => n.isSelected)
                ? "Deselect All"
                : "Select All"}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* 2. "Mark Read (count)" Button */}
        {vm.selectedCount > 0 && (
          <TouchableOpacity
            onPress={vm.handleMarkOnlySelectedAsRead}
            style={styles.markAllButton}
          >
            <ThemedText style={styles.markAllText}>
              {`Mark Read (${vm.selectedCount})`}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* 3. "Mark all Read" Button */}
        {vm.notifications.length > 0 && vm.selectedCount === 0 && (
          <TouchableOpacity
            onPress={vm.handleMarkAllNotificationsAsRead}
            style={styles.markAllButton}
          >
            <ThemedText style={styles.markAllText}>Mark all Read</ThemedText>
          </TouchableOpacity>
        )}

        {/* 4. Delete (count) / Clear All Button */}
        {vm.notifications.length > 0 && (
          <TouchableOpacity
            onPress={vm.handleDeleteSelected}
            style={styles.actionButton}
          >
            <IconSymbol name="trash" size={18} color={"#FF3B30"} />
            <ThemedText
              style={[
                styles.actionButtonText,
                {
                  color: "#FF3B30",
                  marginLeft: 4,
                },
              ]}
            >
              {vm.selectedCount > 0
                ? `Delete (${vm.selectedCount})`
                : "Clear All"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View style={{ opacity: vm.fadeAnim }}>
          {vm.notifications.length > 0 ? (
            vm.notifications.map((notification, index) =>
              renderNotificationItem(notification, index, vm),
            )
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="bell.slash" size={48} color="#BDBDBD" />
              <ThemedText style={styles.emptyStateTitle}>
                No notifications yet
              </ThemedText>
              <ThemedText style={styles.emptyStateMessage}>
                You&apos;re all caught up! We&apos;ll notify you when
                there&apos;s something new.
              </ThemedText>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Full Screen Modal for Reading Notification */}
      <Modal
        visible={vm.modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => vm.setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderRedesigned}>
            <View style={styles.modalIconCircle}>
              <IconSymbol
                name={
                  vm.modalNotification
                    ? vm.getIconForType(vm.modalNotification.type)
                    : "bell.fill"
                }
                size={28}
                color={
                  vm.modalNotification
                    ? vm.getIconColorForType(vm.modalNotification.type)
                    : "#2196F3"
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => vm.setModalVisible(false)}
              style={styles.modalCloseButtonRedesigned}
              accessibilityLabel="Close"
            >
              <IconSymbol name="xmark" size={28} color="#222" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalDivider} />
          <ScrollView contentContainerStyle={styles.modalContentRedesigned}>
            <ThemedText style={styles.modalTitleRedesigned}>
              {vm.modalNotification?.title}
            </ThemedText>
            <ThemedText style={styles.modalMessageRedesigned}>
              {vm.modalNotification?.message}
            </ThemedText>
            <View style={styles.modalTimestampRow}>
              <IconSymbol name="clock" size={14} color="#BDBDBD" />
              <ThemedText style={styles.modalTimestampRedesigned}>
                {vm.modalNotification
                  ? moment(vm.modalNotification.timestamp).format("MMM D, YYYY")
                  : ""}
              </ThemedText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 16, // Adjusted padding for iOS
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    marginRight: 8, // Added margin
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1, // Allow title to take space
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the buttons horizontally
    gap: Platform.OS === "ios" ? 16 : 20, // Increased gap for better spacing when centered
    paddingHorizontal: 16, // Consistent horizontal padding
    paddingVertical: 12, // Vertical padding for the action row
    // borderBottomWidth: 1, // Optional: uncomment if you want a separator line
    // borderBottomColor: "#F0F0F0",
  },
  markAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  markAllText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  clearButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 90 : 90, // Increased padding bottom
    minHeight: "100%",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    paddingVertical: 12, // Adjusted padding
    paddingHorizontal: 12, // Adjusted padding
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: "#FFFFFF", // Default background
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, // Slightly increased shadow
        shadowRadius: 6,
      },
      android: {
        elevation: 2, // Slightly increased elevation
      },
    }),
  },
  unreadItem: {
    // backgroundColor: "#FFFFFF", // Already default
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  readItem: {
    backgroundColor: "#FAFAFA", // Keep for read items
  },
  selectedItem: {
    backgroundColor: "#E3F2FD", // Light blue background for selected items
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  leftColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  radioButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8, // Space between icon and radio
  },
  contentContainer: {
    flex: 1,
    marginLeft: 4, // Add some spacing from the left column
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15, // Slightly smaller
    fontWeight: "600",
    flexShrink: 1, // Allow title to shrink if needed
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196F3",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13, // Slightly smaller
    color: "#555555", // Darker gray for better readability
    marginBottom: 6,
    lineHeight: 18, // Adjusted line height
  },
  timestamp: {
    fontSize: 11, // Slightly smaller
    color: "#AAAAAA", // Lighter gray
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "30%", // Use percentage for better centering
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20, // Larger title
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 15, // Slightly larger
    color: "#757575",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeaderRedesigned: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButtonRedesigned: {
    padding: 8,
    marginLeft: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 0,
  },
  modalContentRedesigned: {
    padding: 28,
    paddingTop: 20,
  },
  modalTitleRedesigned: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 18,
    textAlign: "left",
  },
  modalMessageRedesigned: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "left",
  },
  modalTimestampRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  modalTimestampRedesigned: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
});
