import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Network from "expo-network";

// Environment variables
const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
  authKey: process.env.EXPO_PUBLIC_AUTH_PERSISTENCE_KEY || "@auth_token",
  environment: process.env.EXPO_PUBLIC_APP_ENV || "development",
};

// Configure axios defaults
axios.defaults.timeout = config.timeout;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Create axios instance with minimal config
export const api = axios.create({
  baseURL: config.apiUrl,
  // Don't throw on non-200 responses
  validateStatus: (status) => status >= 200 && status < 500,
});

// Function to check network state
export const checkNetworkAndApi = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    console.log("Network state:", {
      isConnected: networkState.isConnected,
      isInternetReachable: networkState.isInternetReachable,
      type: networkState.type,
    }); // Test API connection with guest endpoint
    const response = await fetch(config.apiUrl + "/api/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("API check status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("API check response:", data);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Network/API check failed:", error);
    return false;
  }
};

// Initialize network check
checkNetworkAndApi().then((isConnected) => {
  console.log("Initial network check result:", isConnected);
});

// Token management with configured key
export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem(config.authKey, token);
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem(config.authKey);
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem(config.authKey);
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Skip adding token for login endpoints
    if (
      config.url?.includes("/api/guest") ||
      config.url?.includes("/api/login")
    ) {
      return config;
    }

    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // More detailed error logging
    console.error("API error details:", {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
      response: error.response?.data,
    });

    if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }

    if (!error.response) {
      // Check if it's a CORS issue
      if (error.message.includes("Network Error")) {
        console.error("Possible CORS or network connectivity issue");
        throw new Error(
          "Unable to connect to the server. Please check your internet connection or try again later.",
        );
      }
      throw new Error(error.message || "Network error occurred");
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      await removeAuthToken();
      throw new Error("Session expired. Please log in again.");
    }

    // Handle specific error messages from the server
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    throw new Error(errorMessage);
  },
);
