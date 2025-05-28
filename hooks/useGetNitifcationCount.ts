import { RootState } from "@/store";
import { useSelector } from "react-redux";

export function useGetNotificationCount() {
  const unreadCount = useSelector(
    (state: RootState) =>
      state.notifications.filter((notification) => !notification.isRead).length,
  );

  return unreadCount;
}
