import { IconSymbolName } from "@/components/ui/IconSymbol";
import { Notification } from "@/services/notifications/useNotificationsService";

import {
  markAllAsRead,
  markAsRead,
  setNotifications,
} from "@/store/features/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function useViewModel() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  const [selectedCount, setSelectedCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNotification, setModalNotification] =
    useState<Notification | null>(null);
  // Generate notifications from API and update Redux only if changed

  // useEffect(() => {
  //   if (userData?.data?.debtsList) {
  //     const generated = generateAllNotifications(userData.data.debtsList);
  //     const shouldUpdate = !isEqual(
  //       generated.map((g) => ({ ...g, isRead: false })),
  //       notifications.map((n) => ({ ...n, isRead: false })),
  //     );
  //     if (shouldUpdate) {
  //       // Preserve read states when updating
  //       const updatedNotifications = generated.map((newNotif) => {
  //         const existingNotif = notifications.find((n) => n.id === newNotif.id);
  //         return existingNotif
  //           ? { ...newNotif, isRead: existingNotif.isRead }
  //           : newNotif;
  //       });
  //       dispatch(setNotifications(updatedNotifications));
  //     }
  //   }
  // }, [
  //   userData?.data?.debtsList,
  //   generateAllNotifications,
  //   notifications,
  //   dispatch,
  // ]); // Fix dependency array

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Memoize selection count update
  const updateSelectedCount = useCallback(
    (newNotifications: Notification[]): void => {
      const count = newNotifications.filter((n) => n.isSelected).length;
      setSelectedCount(count);
    },
    [],
  );

  // All handlers now update Redux state
  const handleToggleSelect = (id: string): void => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isSelected: !n.isSelected } : n,
    );
    dispatch(setNotifications(updated));
    updateSelectedCount(updated);
  };

  const handleSelectAll = (): void => {
    const allSelected =
      notifications.length > 0 && notifications.every((n) => n.isSelected);
    const updated = notifications.map((n) => ({
      ...n,
      isSelected: !allSelected,
    }));
    dispatch(setNotifications(updated));
    updateSelectedCount(updated);
  };

  const handleMarkSelectedAsRead = (): void => {
    const updated = notifications.map((n) =>
      n.isSelected ? { ...n, isRead: true, isSelected: false } : n,
    );
    dispatch(setNotifications(updated));
    updateSelectedCount(updated);
  };

  const handleMarkOnlySelectedAsRead = (): void => {
    const updated = notifications.map((n) =>
      n.isSelected ? { ...n, isRead: true, isSelected: false } : n,
    );
    dispatch(setNotifications(updated));
    updateSelectedCount(updated);
  };
  const handleMarkAllNotificationsAsRead = (): void => {
    dispatch(markAllAsRead());
    updateSelectedCount(
      notifications.map((n) => ({ ...n, isSelected: false })),
    );
  };

  const handleDeleteSelected = (): void => {
    const updated = notifications.filter((n) => !n.isSelected);
    dispatch(setNotifications(updated));
    updateSelectedCount(updated);
  };
  const handleNotificationPress = (id: string): void => {
    if (selectedCount > 0) {
      handleToggleSelect(id);
      return;
    }
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      setModalNotification(notification);
      setModalVisible(true);
      dispatch(markAsRead(id));
    }
  };

  const getIconForType = useCallback((type: string): IconSymbolName => {
    switch (type) {
      case "payment":
        return "creditcard.fill";
      case "reminder":
        return "bell.fill";
      case "system":
        return "gear";
      default:
        return "bell.fill";
    }
  }, []);

  const getIconColorForType = useCallback((type: string): string => {
    switch (type) {
      case "payment":
        return "#4CAF50";
      case "reminder":
        return "#FF9800";
      case "system":
        return "#2196F3";
      default:
        return "#757575";
    }
  }, []);

  return {
    fadeAnim,
    slideAnim,
    notifications,
    selectedCount,
    modalVisible,
    setModalVisible,
    modalNotification,
    setModalNotification,
    handleToggleSelect,
    handleSelectAll,
    handleMarkSelectedAsRead,
    handleMarkOnlySelectedAsRead,
    handleMarkAllNotificationsAsRead,
    handleDeleteSelected,
    handleNotificationPress,
    getIconForType,
    getIconColorForType,
  };
}
