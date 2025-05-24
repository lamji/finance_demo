import { api } from "./api";

export const testApiConnection = async () => {
  try {
    // Try to make a simple GET request to the root URL
    const response = await api.get("/");
    console.log("API connection successful:", response.status);
    return true;
  } catch (error) {
    console.log("API connection test failed:", error);
    return false;
  }
};
