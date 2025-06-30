import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

/**
 * useAuthGuard
 * Redirects to /login if no userToken is found in AsyncStorage.
 * Returns { checking: boolean } to indicate if the check is in progress.
 */
export function useAuthGuard() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  return { checking };
}
