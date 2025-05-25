import { useMutation } from "@tanstack/react-query";
import { api, setAuthToken } from "../api";
import { ApiResponse, GuestLoginResponse } from "../types";

const guestLogin = async (): Promise<ApiResponse<GuestLoginResponse>> => {
  try {
    console.log("Attempting guest login");

    // Get guest credentials
    const response = await api.post("/api/guest", null, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 400 || !response.data) {
      console.error(
        "Guest credential generation failed:",
        response.status,
        response.data,
      );
      throw new Error(
        response.data?.message ||
          "Failed to generate guest credentials. Please try again later.",
      );
    }

    const guestData = response.data;

    // Now we need to login with the received credentials
    console.log("Attempting login with guest credentials");
    const loginResponse = await api.post("/api/guest", null, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (loginResponse.status >= 400 || !loginResponse.data) {
      console.error(
        "Login failed with guest credentials:",
        loginResponse.status,
        loginResponse.data,
      );
      throw new Error(
        loginResponse.data?.message || "Failed to login with guest credentials",
      );
    }

    console.log("Login response:", loginResponse.data);

    // Store the token from login response
    const token = loginResponse.data?.token;
    if (token) {
      await setAuthToken(token);
      console.log("Token stored successfully");
    } else {
      console.warn("No token received in login response");
      throw new Error("No authentication token received from server");
    }

    // Return in the expected ApiResponse format
    return {
      data: loginResponse.data,
      message: guestData.message || "Guest login successful",
      status: loginResponse.status,
    };
  } catch (error) {
    console.error("Guest login error:", {
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
