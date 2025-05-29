import {
  Notification,
  useNotificationsService,
} from "@/services/notifications/useNotificationsService";
import { useGetUser } from "@/services/query/usegetUser";
import { RootState } from "@/store";
import { setNotifications } from "@/store/features/notificationSlice";

import isEqual from "lodash/isEqual";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  refreshNotifications: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { generateAllNotifications } = useNotificationsService();
  const dispatch = useDispatch();
  const { data: userData } = useGetUser();
  const notifications = useSelector((state: RootState) => state.notifications);
  const refreshToken = useSelector(
    (state: RootState) => state.notificationRefresh.token,
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Memoize refresh function to prevent unnecessary re-renders
  const refreshNotifications = useCallback(() => {
    if (userData?.data?.debtsList) {
      const generated = generateAllNotifications(userData.data.debtsList);
      const shouldUpdate = !isEqual(
        generated.map((g) => ({ ...g, isRead: false })),
        notifications.map((n) => ({ ...n, isRead: false })),
      );

      if (shouldUpdate) {
        const updatedNotifications = generated.map((newNotif) => {
          const existingNotif = notifications.find((n) => n.id === newNotif.id);
          return existingNotif
            ? { ...newNotif, isRead: existingNotif.isRead }
            : newNotif;
        });
        dispatch(setNotifications(updatedNotifications));
      }
    }
  }, [
    userData?.data?.debtsList,
    notifications,
    dispatch,
    generateAllNotifications,
  ]);

  // Auto-refresh when data changes
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications, refreshToken]);

  const value = React.useMemo(
    () => ({
      unreadCount,
      notifications,
      refreshNotifications,
    }),
    [unreadCount, notifications, refreshNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
