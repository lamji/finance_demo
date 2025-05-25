import { useCallback } from "react";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import useHeaderTheme from "@/hooks/useHeaderTheme";

export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "failed" | "pending";
  referenceNo: string;
  paymentMethod: string;
}

export interface PaymentDetails {
  date: string;
  amount: string;
  paymentMethod: string;
  referenceNo: string;
}

interface PaymentViewModel {
  userType: "guest" | "one-time" | "monthly";
  lastPayment: PaymentDetails | null;
  nextPayment: PaymentDetails | null;
  paymentHistory: PaymentHistoryItem[];
  purchaseDetails: PaymentDetails | null;
  onUpgradePress: () => void;
  headerConfig: {
    backgroundColor: { light: string; dark: string };
    userName: string;
    safeAreaBackground: string;
  };
}

export default function useViewModel(): PaymentViewModel {
  const user = useAppSelector((state) => state.auth.user);
  //   const subscriptionType = user?.role || "guest";
  const subscriptionType = "one-time"; // Simulated subscription type for this example
  const { headerBgColors } = useHeaderTheme();

  // Mock data - In a real app, this would come from an API
  const mockPaymentHistory: PaymentHistoryItem[] = [
    {
      id: "1",
      date: "2024-05-01",
      amount: "$9.99",
      status: "paid",
      referenceNo: "REF123456",
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      date: "2024-04-01",
      amount: "$9.99",
      status: "paid",
      referenceNo: "REF123455",
      paymentMethod: "Credit Card",
    },
  ];

  const mockLastPayment: PaymentDetails = {
    date: "2024-05-01",
    amount: "$9.99",
    paymentMethod: "Credit Card",
    referenceNo: "REF123456",
  };

  const mockNextPayment: PaymentDetails = {
    date: "2024-06-01",
    amount: "$9.99",
    paymentMethod: "Credit Card",
    referenceNo: "Pending",
  };

  const mockPurchaseDetails: PaymentDetails = {
    date: "2024-03-03",
    amount: "$49.99",
    paymentMethod: "PayPal",
    referenceNo: "OTP123456",
  };

  const onUpgradePress = useCallback(() => {
    router.push("/profile/upgrade");
  }, []);

  const headerConfig = {
    backgroundColor: headerBgColors,
    userName: user?.name || "Guest",
    safeAreaBackground: headerBgColors.light,
  };

  return {
    userType: subscriptionType as "guest" | "one-time" | "monthly",
    lastPayment: subscriptionType === "monthly" ? mockLastPayment : null,
    nextPayment: subscriptionType === "monthly" ? mockNextPayment : null,
    paymentHistory: subscriptionType === "monthly" ? mockPaymentHistory : [],
    purchaseDetails:
      subscriptionType === "one-time" ? mockPurchaseDetails : null,
    onUpgradePress,
    headerConfig,
  };
}
