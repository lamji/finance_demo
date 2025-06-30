import { DebtType } from "@/components/screens/debt/useViewModel";
import { triggerRefresh } from "@/store/features/notificationSlice";
import { showAlert } from "@/store/features/sliceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "../api";
import { Debt } from "../query/usegetUser";

interface UpdateDebtPayload {
  type: DebtType;
  debtId: string;
  bank?: string;
  totalDebt?: number;
  monthlyPayment?: string;
  term_length?: number;
  term_type?: "months" | "years";
  start_date?: string;
  due_date?: string;
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload: UpdateDebtPayload) => {
      const { data } = await api.put<Debt>(`/api/debts/update`, payload);
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        showAlert({
          type: "success",
          message: `Successfully updated debt for ${data.bank}`,
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
          message: error.message || "Failed to update debt. Please try again.",
        }),
      );

      console.error("Error updating debt:", error);
    },
  });
}
