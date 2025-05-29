import useHeaderTheme from "@/hooks/useHeaderTheme";
import { Debt, useGetUser } from "@/services/query/usegetUser";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

export default function useViewModel() {
  const { data: user, isLoading: fetchLoading, error } = useGetUser();
  const { theme, tintColor, headerBgColors } = useHeaderTheme();
  const { safeAreaBackground } = useHeaderTheme();
  const dispatch = useAppDispatch();
  const debts = user?.data?.debtsList;
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

  // Replace the any type with proper Debt interface
  const openLoans =
    debts?.filter((debt: Debt) => {
      // Validate the debt object has required properties
      if (!debt || typeof debt.remaining_balance === "undefined") return false;
      return Number(debt.remaining_balance) > 0;
    }) || [];

  const closedLoans =
    debts?.filter((debt: Debt) => {
      if (!debt || typeof debt.remaining_balance === "undefined") return false;
      return Number(debt.remaining_balance) === 0;
    }) || [];

  return {
    data: user ? [user] : [],
    isLoading,
    error,
    theme,
    tintColor,
    headerBgColors,
    safeAreaBackground,
    dispatch,
    debts,

    fadeAnim,
    scaleAnim,
    pulseValue,
    calculateProgress,
    openLoans,
    closedLoans,
    fetchLoading,
  };
}
