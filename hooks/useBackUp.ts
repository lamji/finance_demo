import { api } from "@/services/api";
import { useCallback, useRef } from "react";
import { Alert } from "react-native";

interface UseBackupOptions {
  enabled: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface BackupResponse {
  success: boolean;
  timestamp: string;
  message: string;
}

export function useBackup({ enabled, onSuccess, onError }: UseBackupOptions) {
  const lastBackupRef = useRef<string | null>(null);

  // Manual backup function
  const backupNow = useCallback(async () => {
    try {
      const result = await api.post<BackupResponse>("/api/backup", {
        isAutomatic: false,
        timestamp: new Date().toISOString(),
        data: [], // Data to be backed up, currently an empty array
      });

      lastBackupRef.current = result.data.timestamp;
      onSuccess?.();
      Alert.alert("Success", "Backup completed successfully");
    } catch (error) {
      onError?.(error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Backup failed",
      );
    }
  }, [onSuccess, onError]);
  return {
    backupNow,
    lastBackup: lastBackupRef.current,
    isScheduled: false,
  };
}

// const { backupNow, lastBackup, isScheduled } = useBackup({
//   enabled: true,
//   onSuccess: () => {
//     console.log("Backup completed successfully");
//   },
//   onError: (error) => {
//     console.error("Backup failed:", error);
//   },
// });
