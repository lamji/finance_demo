import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";
import { setBackupEnabled, setLastBackupDate, addBackupHistory } from "../store/features/backupSlice";
import { api } from "./api";

export const BACKUP_TASK_NAME = "background-backup";

// Register the background task
TaskManager.defineTask(BACKUP_TASK_NAME, async () => {
  try {
    const state = store.getState();
    
    if (!state.backup.isBackupEnabled) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Prepare backup payload
    const backupPayload = {
      timestamp: new Date().toISOString(),
      isAutomatic: true,
      data: {
        debts: state.debt.debts,
        user: state.auth.user,
      },
    };

    // Send backup to API
    const response = await api.post("/backup", backupPayload);

    if (response.status === 200) {
      store.dispatch(setLastBackupDate(backupPayload.timestamp));
      store.dispatch(
        addBackupHistory({
          timestamp: backupPayload.timestamp,
          success: true,
        })
      );
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      throw new Error(\`Backup failed with status \${response.status}\`);
    }
  } catch (error) {
    console.error("Background backup failed:", error);
    store.dispatch(
      addBackupHistory({
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    );
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKUP_TASK_NAME, {
      minimumInterval: 60 * 60, // 1 hour minimum interval required by iOS
      stopOnTerminate: false, // Android only
      startOnBoot: true, // Android only
    });
    console.log("Background backup task registered");
  } catch (err) {
    console.error("Task registration failed:", err);
  }
}

export async function unregisterBackgroundTask() {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKUP_TASK_NAME);
    store.dispatch(setBackupEnabled(false));
    console.log("Background backup task unregistered");
  } catch (err) {
    console.error("Task unregistration failed:", err);
  }
}

export async function performManualBackup() {
  try {
    const state = store.getState();

    const backupPayload = {
      timestamp: new Date().toISOString(),
      isAutomatic: false,
      data: {
        debts: state.debt.debts,
        user: state.auth.user,
      },
    };

    const response = await api.post("/backup", backupPayload);

    if (response.status === 200) {
      store.dispatch(setLastBackupDate(backupPayload.timestamp));
      store.dispatch(
        addBackupHistory({
          timestamp: backupPayload.timestamp,
          success: true,
        })
      );
      return { success: true };
    } else {
      throw new Error(\`Manual backup failed with status \${response.status}\`);
    }
  } catch (error) {
    console.error("Manual backup failed:", error);
    store.dispatch(
      addBackupHistory({
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
