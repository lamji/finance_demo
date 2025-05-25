import { IconSymbol } from "@/components/ui/IconSymbol";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { RootState } from "@/store";
import { logout } from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { ACCOUNT_FEATURES } from "@/helper/acountFeatures";

type IconName = Parameters<typeof IconSymbol>[0]["name"];
type BackupFrequency = "daily" | "weekly" | "monthly" | null;

export type AccountType = "guest" | "one-time" | "monthly";

export interface AccountFeatures {
  maxRecords: number;
  storage: "shared" | "local";
  cloudBackup: boolean;
  price: string | null;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: IconName;
  onPress: () => void;
  color?: string;
  badge?: number;
}

export interface ProfileStats {
  totalDebts: number;
  paidDebts: number;
  activePayments: number;
}

export default function useViewModel() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { tintColor, theme } = useHeaderTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [frequency, setFrequency] = useState<
    "daily" | "weekly" | "monthly" | null
  >(null);

  // Backup state management
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState<BackupFrequency>(null);

  // Simulated account type - in real app, this would come from user data
  const accountType = "monthly" as AccountType;
  const accountFeatures = ACCOUNT_FEATURES[accountType];

  const stats: ProfileStats = {
    totalDebts: 5,
    paidDebts: 2,
    activePayments: 3,
  };

  const handleBackupFrequencySelect = useCallback(
    (frequency: BackupFrequency) => {
      setBackupFrequency(frequency);
      // TODO: Save to backend/local storage
    },
    [],
  );

  const handleBackupNow = useCallback(async () => {
    try {
      // TODO: Implement actual backup
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert("Success", "Data backed up successfully!");
    } catch (error) {
      Alert.alert("Error", "Backup failed. Please try again.");
    }
  }, []);

  const handleUpgrade = useCallback(() => {
    Alert.alert(
      "Upgrade Account",
      accountType === "guest"
        ? "Upgrade to one-time plan for unlimited records and local storage?"
        : "Upgrade to monthly plan for cloud backup and premium features?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Upgrade",
          onPress: () => {
            // TODO: Implement actual upgrade logic with API
            Alert.alert("Success", "Account upgraded successfully!");
          },
        },
      ],
    );
  }, [accountType]);

  const handleBackup = useCallback(() => {
    handleBackupNow();
  }, [handleBackupNow]);

  const handleDowngrade = useCallback(() => {
    Alert.alert(
      "Downgrade Account",
      "Are you sure you want to downgrade to a one-time plan? You will lose cloud backup functionality.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Downgrade",
          style: "destructive",
          onPress: () => {
            // TODO: Implement actual downgrade logic with API
            Alert.alert(
              "Success",
              "Account downgraded successfully. Changes will take effect at the end of your billing period.",
            );
          },
        },
      ],
    );
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "notifications",
      title: "Notifications",
      icon: "bell.fill",
      onPress: () => console.log("Notifications pressed"),
      badge: 3,
    },
    // {
    //   id: "backup",
    //   title: "Backup",
    //   icon: "icloud.and.arrow.up.fill",
    //   onPress: () => setModalVisible(true),
    // },
    {
      id: "logout",
      title: "Logout",
      icon: "rectangle.portrait.and.arrow.right",
      onPress: () => {
        dispatch(logout());
        router.replace("/login");
      },
      color: "#FF3B30",
    },
  ];

  const handleOpenBackup = () => {
    Alert.alert("Backup", "Would you like to open the backup settings?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open",
        onPress: () => {
          setModalVisible(true);
        },
      },
    ]);
  };

  return {
    user,
    stats,
    menuItems,
    tintColor,
    theme,
    accountType,
    accountFeatures,
    backupFrequency,
    showBackupModal,
    modalVisible,
    setModalVisible,
    frequency,
    handleBackupFrequencySelect,
    handleBackupNow,
    handleUpgrade,
    handleBackup,
    handleDowngrade,
    handleOpenBackup,
    setFrequency,
  };
}
