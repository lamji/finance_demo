import { triggerRefresh } from "@/store/features/notificationSlice";
import { showAlert } from "@/store/features/sliceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "../api";

interface SaveTransactionPayload {
  debtId: string;
  amount: number;
  type: "payment" | "extra";
  description?: string;
  date: string;
  bank: string;
}

export function useSaveTransaction() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload: SaveTransactionPayload) => {
      const { data } = await api.post("/api/debts/transactions", payload);
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        showAlert({
          type: "success",
          message: `Transaction of ${data.amount} successfully recorded for ${data.bank}`,
        }),
      );
      dispatch(triggerRefresh());
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      dispatch(
        showAlert({
          type: "failed",
          message:
            error.message || "Failed to save transaction. Please try again.",
        }),
      );

      console.error("Error saving transaction:", error);
    },
  });
}
