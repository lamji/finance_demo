import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface BackupSettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
  isMonthlySubscriber: boolean;
  selectedFrequency: "daily" | "weekly" | "monthly" | null;
  onFrequencySelect: (frequency: "daily" | "weekly" | "monthly") => void;
  onBackupNow: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function BackupSettingsModal({
  isVisible,
  onClose,
  isMonthlySubscriber,
  selectedFrequency,
  onFrequencySelect,
  onBackupNow,
}: BackupSettingsModalProps) {
  const theme = useColorScheme() ?? "light";

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Backup Settings</ThemedText>
          {!isMonthlySubscriber && (
            <View style={[styles.badge, { backgroundColor: "#FF3B30" }]}>
              <ThemedText style={styles.badgeText}>Monthly Only</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.description}>
            {isMonthlySubscriber
              ? "Select how often you want your data to be automatically backed up to the cloud."
              : "Automatic backup is available only for monthly subscribers. Upgrade your account to enable this feature."}
          </ThemedText>

          {isMonthlySubscriber && (
            <>
              <View style={styles.optionsContainer}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      selectedFrequency === option.value && {
                        backgroundColor: Colors[theme].tint + "20",
                        borderColor: Colors[theme].tint,
                      },
                    ]}
                    onPress={() =>
                      onFrequencySelect(
                        option.value as "daily" | "weekly" | "monthly",
                      )
                    }
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedFrequency === option.value && {
                          color: Colors[theme].tint,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                onPress={onBackupNow}
                style={[
                  styles.backupNowButton,
                  { backgroundColor: Colors[theme].tint },
                ]}
              >
                <IconSymbol
                  name="icloud.and.arrow.up.fill"
                  size={20}
                  color="#fff"
                />
                <ThemedText style={styles.backupNowText}>Backup Now</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: Colors[theme].tint }]}
          onPress={onClose}
        >
          <ThemedText style={styles.closeButtonText}>Done</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  container: {
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    paddingTop: 8,
    paddingBottom: 80, // Add padding at bottom to prevent overlap with close button
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  optionText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 24,
  },
  backupNowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
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
  backupNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
