import { triggerRefresh } from "@/store/features/notificationSlice";
import { showAlert } from "@/store/features/sliceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "../api";
import { Debt } from "../query/usegetUser";

import { DebtType } from "@/components/screens/debt/useViewModel";

interface AddDebtPayload {
  type: DebtType;
  bank: string;
  totalDebt: number;
  monthlyPayment: string;
  term_length: number;
  term_type: "months" | "years";
  start_date: string;
  due_date: string;
}

export function useAddDebt() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (newDebt: AddDebtPayload) => {
      const { data } = await api.post<Debt>("/api/debts", newDebt);
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        showAlert({
          type: "success",
          message: `Successfully added debt for ${data.bank}`,
        }),
      );
      // dispatch(triggerRefresh());
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      dispatch(triggerRefresh());
    },
    onError: (error: Error) => {
      dispatch(
        showAlert({
          type: "failed", // Note: using "failed" instead of "error" to match your slice type
          message: error.message || "Failed to add debt. Please try again.",
        }),
      );

      console.error("Error adding debt:", error);
    },
  });
}
