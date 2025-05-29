import { RootState } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useGetNotificationCount() {
  // Get the refresh token from Redux
  const refreshToken = useSelector(
    (state: RootState) => state.notificationRefresh.token,
  );

  // Get the current notification state from Redux
  const notifications = useSelector((state: RootState) => state.notifications);

  // Calculate unread count
  const [unreadCount, setUnreadCount] = useState(0);

  // Update the count whenever notifications or refreshToken changes
  useEffect(() => {
    const count = notifications.filter(
      (notification) => !notification.isRead,
    ).length;
    setUnreadCount(count);
  }, [notifications, refreshToken]); // Add refreshToken as a dependency

  // Keep the query client subscription for API-driven updates
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      // This will just trigger a re-render when queries change
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return unreadCount;
}
