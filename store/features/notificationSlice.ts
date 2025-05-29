import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Keep the Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "payment" | "reminder" | "system";
  isSelected?: boolean;
}

// Keep notifications as an array, add a separate refreshToken
const initialState: Notification[] = [];

// Create a separate slice just for refresh token
const refreshSlice = createSlice({
  name: "notificationRefresh",
  initialState: { token: 0 },
  reducers: {
    triggerRefresh(state) {
      state.token += 1;
    },
  },
});

// Keep the original notification slice unchanged
const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      return action.payload; // Replace entire state
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.find((n) => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
    markAllAsRead(state) {
      state.forEach((n) => (n.isRead = true));
    },
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

export const { triggerRefresh } = refreshSlice.actions;

export default slice.reducer;
export const refreshReducer = refreshSlice.reducer;
