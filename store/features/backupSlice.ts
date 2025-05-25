import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BackupState {
  isBackupEnabled: boolean;
  lastBackupDate: string | null;
  backupFrequency: number; // in hours
  backupHistory: {
    timestamp: string;
    success: boolean;
    error?: string;
  }[];
  isPendingBackup: boolean;
}

const initialState: BackupState = {
  isBackupEnabled: true,
  lastBackupDate: null,
  backupFrequency: 24, // backup every 24 hours by default
  backupHistory: [],
  isPendingBackup: false,
};

const backupSlice = createSlice({
  name: "backup",
  initialState,
  reducers: {
    setBackupEnabled: (state, action: PayloadAction<boolean>) => {
      state.isBackupEnabled = action.payload;
    },
    setLastBackupDate: (state, action: PayloadAction<string>) => {
      state.lastBackupDate = action.payload;
    },
    setBackupFrequency: (state, action: PayloadAction<number>) => {
      state.backupFrequency = action.payload;
    },
    addBackupHistory: (
      state,
      action: PayloadAction<{
        timestamp: string;
        success: boolean;
        error?: string;
      }>,
    ) => {
      state.backupHistory.unshift(action.payload);
      // Keep only last 50 entries
      if (state.backupHistory.length > 50) {
        state.backupHistory = state.backupHistory.slice(0, 50);
      }
    },
    setIsPendingBackup: (state, action: PayloadAction<boolean>) => {
      state.isPendingBackup = action.payload;
    },
  },
});

export const {
  setBackupEnabled,
  setLastBackupDate,
  setBackupFrequency,
  addBackupHistory,
  setIsPendingBackup,
} = backupSlice.actions;
export default backupSlice.reducer;
