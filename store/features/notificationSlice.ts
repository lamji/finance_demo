import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// reuse your Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "payment" | "reminder" | "system";
  isSelected?: boolean;
}

const initialState: Notification[] = [];

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      return action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.find((n) => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
    markAllAsRead(state) {
      state.forEach((n) => (n.isRead = true));
    },
    // optional: remove read or delete notifications
    removeNotification(state, action: PayloadAction<string>) {
      return state.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
} = slice.actions;

export default slice.reducer;
