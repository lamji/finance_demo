import { useMutation } from "@tanstack/react-query";
import { api, setAuthToken } from "../api";
import { ApiResponse, GuestLoginResponse } from "../types";

const guestLogin = async (): Promise<ApiResponse<GuestLoginResponse>> => {
  try {
    console.log("Attempting guest login with axios");

    // Log axios configuration
    console.log("Axios config:", {
      baseURL: api.defaults.baseURL,
      timeout: api.defaults.timeout,
      headers: api.defaults.headers,
    });

    const response = await api.post("/api/guest");
    console.log("Axios response status:", response.status);
    console.log("Axios response data:", response.data);

    if (response.status >= 400) {
      console.error("Guest login failed with status:", response.status);
      throw new Error(
        `Server responded with status ${response.status}: ${response.data}`,
      );
    }

    const guestData = response.data;

    // Now we need to login with the received credentials
    console.log("Attempting login with guest credentials");
    const loginResponse = await api.post("/api/login", {
      email: guestData.email,
      password: guestData.password,
    });

    if (loginResponse.status >= 400) {
      console.error(
        "Login failed with guest credentials:",
        loginResponse.status,
      );
      throw new Error(`Login failed: ${loginResponse.data}`);
    }

    console.log("Login response:", loginResponse.data);

    // Store the token from login response
    if (loginResponse.data.token) {
      await setAuthToken(loginResponse.data.token);
      console.log("Token stored successfully");
    } else {
      console.warn("No token received in login response");
    }

    // Return in the expected ApiResponse format
    return {
      data: loginResponse.data,
      message: guestData.message,
      status: loginResponse.status,
    };
  } catch (error) {
    console.error("Guest login axios error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error(
      error instanceof Error ? error.message : "Failed to login as guest",
    );
  }
};

export function useGuestLogin() {
  return useMutation({
    mutationFn: guestLogin,
  });
}
