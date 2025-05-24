import { IconSymbol } from "@/components/ui/IconSymbol";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { router } from "expo-router";

type IconName = Parameters<typeof IconSymbol>[0]["name"];

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
}

export interface QuickAction {
  id: string;
  title: string;
  icon: IconName;
  onPress: () => void;
}

export default function useViewModel() {
  const { theme, tintColor, headerBgColors } = useHeaderTheme();

  // In a real app, these would come from an API or database
  const walletStats: WalletStats = {
    totalBalance: 2750,
    totalDebt: 15750,
    paid: 2500,
  };

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

  const quickActions: QuickAction[] = [
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

  const headerConfig = {
    backgroundColor: headerBgColors,
    userName: "John Doe",
    safeAreaBackground: headerBgColors[theme],
  };

  return {
    theme,
    tintColor,
    walletStats,
    recentActivity,
    scheduleItems,
    quickActions,
    headerConfig,
  };
}
