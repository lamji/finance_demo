import { getAuthToken } from "@/services/api";
import { useEffect, useState } from "react";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const currentToken = await getAuthToken();
      setToken(currentToken);
    };

    checkToken();
  }, []);

  return token;
}
