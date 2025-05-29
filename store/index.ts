import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./features/authSlice";
import debtReducer from "./features/debtSlice";
import loadingReducer from "./features/loadingSlice";
import notificationsReducer, {
  refreshReducer,
} from "./features/notificationSlice";
import alertReducer from "./features/sliceAlert";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["debt", "auth", "notifications"], // Persist both debt and auth reducers
};

const rootReducer = combineReducers({
  debt: debtReducer,
  auth: authReducer,
  alert: alertReducer,
  notifications: notificationsReducer,
  loading: loadingReducer,
  notificationRefresh: refreshReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
