import { useAuthGuard } from "@/hooks/useAuthGuard";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { useGetUser } from "@/services/query/usegetUser";
import { RootState } from "@/store";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated } from "react-native";
import { useSelector } from "react-redux";
// Debug variable - change this to test different subscription types
const DEBUG_SUBSCRIPTION_TYPE: SubscriptionType = "guest"; // Change to "guest" | "one-time" | "monthly"

export type SubscriptionType = "guest" | "one-time" | "monthly";

export const formatTimeSinceBackup = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} secs ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(seconds / 3600);
  if (hours === 1) {
    return "1 hour ago";
  }
  return `${hours} hours ago`;
};

export interface ActivityItem {
  title: string;
  description: string;
  amount: string;
  date: string;
  isPositive: boolean;
}

export interface ScheduleItem {
  title: string;
  dueDate: string;
  amount: string;
  isPaid: boolean;
}

export interface WalletStats {
  totalBalance: number;
  totalDebt: number;
  paid: number;
  totalMonthlyDue: number;
  nextDueDate: string;
}

export default function useViewModel() {
  const { theme, tintColor, headerBgColors } = useHeaderTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: userData, isLoading: isUserLoading } = useGetUser();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [timeSinceBackup, setTimeSinceBackup] = useState<number>(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const { checking } = useAuthGuard();

  // Uses the debug variable for easy testing
  const subscriptionType: SubscriptionType = DEBUG_SUBSCRIPTION_TYPE;

  /**
   * @Api Call
   * get the data from logged user
   */
  const userDataGet = userData

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (lastBackup) {
      // Update immediately
      const updateTime = () => {
        const seconds = Math.floor(
          (Date.now() - new Date(lastBackup).getTime()) / 1000,
        );
        setTimeSinceBackup(seconds);
      };

      updateTime();

      // Then set up interval - update every second for the first hour, then every hour
      interval = setInterval(() => {
        updateTime();
        const seconds = Math.floor(
          (Date.now() - new Date(lastBackup).getTime()) / 1000,
        );
        if (seconds >= 3600) {
          // After 1 hour, clear current interval and set new hourly interval
          clearInterval(interval);
          interval = setInterval(updateTime, 3600000); // Update every hour
        }
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [lastBackup]);

  const startBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isBackingUp) {
        startBounceAnimation(); // Loop animation while backing up
      }
    });
  };

  const simulateBackup = () => {
    return new Promise((resolve) => {
      const currentTime = new Date().toISOString();
      setLastBackup(currentTime); // Set immediate feedback
      setTimeout(() => {
        resolve(true);
      }, 2000); // Simulate 2 second backup
    });
  };

  const handleBackupPress = async () => {
    if (isBackingUp) return; // Prevent multiple backups

    if (subscriptionType !== "monthly") {
      Alert.alert(
        "Premium Feature",
        "Automatic backup is only available with monthly subscription.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Upgrade Now",
            onPress: () => {
              // router.push("/profile/upgrade");
            },
          },
        ],
      );
      return false;
    }

    setIsBackingUp(true);
    startBounceAnimation();

    try {
      await simulateBackup();
    } finally {
      setIsBackingUp(false);
      bounceAnim.setValue(1); // Reset animation
    }
    return true;
  };

  // Calculate totals from debtsList
  const calculateWalletStats = (): WalletStats => {
    if (!userData?.data?.debtsList) {
      return {
        totalBalance: 0,
        totalDebt: 0,
        paid: 0,
        totalMonthlyDue: 0,
        nextDueDate: new Date().toISOString(),
      };
    }

    const debts = userData.data.debtsList;

    const totalDebt = debts.reduce((sum, debt) => sum + debt.totalDebt, 0);
    const totalPaid = debts.reduce((sum, debt) => sum + debt.total_paid, 0);
    const totalMonthlyDue = debts.reduce(
      (sum, debt) => sum + debt.monthly_due,
      0,
    );

    // Find next due date from all pending payments
    const allPendingPayments = debts.flatMap((debt) =>
      (debt.monthly_payments || [])
        .filter((payment) => payment.status === "pending")
        .map((payment) => new Date(payment.due_date)),
    );

    const nextDueDate =
      allPendingPayments.length > 0
        ? new Date(
            Math.min(...allPendingPayments.map((date) => date.getTime())),
          ).toISOString()
        : new Date().toISOString();

    return {
      totalBalance: totalDebt - totalPaid,
      totalDebt,
      paid: totalPaid,
      totalMonthlyDue,
      nextDueDate,
    };
  };

  // Replace the hardcoded walletStats with calculated values
  const walletStats = calculateWalletStats();

  const recentActivity: ActivityItem[] = [
    {
      title: "Payment Made",
      description: "Chase Sapphire",
      amount: "-$500",
      date: "Today",
      isPositive: false,
    },
    {
      title: "New Debt Added",
      description: "Home Improvement Loan",
      amount: "+$5,000",
      date: "May 15, 2025",
      isPositive: true,
    },
  ];

  const scheduleItems: ScheduleItem[] = [
    {
      title: "Chase Sapphire",
      dueDate: "Jun 10",
      amount: "$750",
      isPaid: false,
    },
    {
      title: "Student Loan",
      dueDate: "Jun 15",
      amount: "$500",
      isPaid: true,
    },
  ];

  const quickActions = [
    {
      id: "add_debt",
      title: "Add Debt",
      icon: "plus.circle.fill",
      onPress: () => {
        router.push("/debts/add");
      },
    },
    {
      id: "pay",
      title: "Pay",
      icon: "creditcard.fill",
      onPress: () => {
        // Payment action
        console.log("Pay pressed");
      },
    },
    {
      id: "history",
      title: "History",
      icon: "house.fill",
      onPress: () => {
        // History action
        console.log("History pressed");
      },
    },
  ];

  // Calculate progress percentage for debt payment
  const calculateProgressPercentage = () => {
    const totalDebt = walletStats.totalDebt;
    const paid = walletStats.paid;

    if (totalDebt === 0) return 0;

    const percentage = (paid / totalDebt) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };

  const progressPercentage = calculateProgressPercentage();

  // Update headerConfig
  const headerConfig = {
    backgroundColor: headerBgColors,
    userName: user?.name || "Guest",
    safeAreaBackground: headerBgColors[theme],
  };
  // Function to navigate to notifications screen
  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  return {
    theme,
    tintColor,
    walletStats,
    recentActivity,
    scheduleItems,
    quickActions,
    headerConfig,
    handleBackupPress,
    lastBackup,
    timeSinceBackup,
    isBackingUp,
    bounceAnim,
    progressPercentage,
    handleNotificationsPress,
    isUserLoading,
    checking,
  };
}
