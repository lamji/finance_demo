import { showAlert } from "@/store/features/sliceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "../api";

interface DeleteDebtPayload {
  debtId: string;
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload: DeleteDebtPayload) => {
      const { data } = await api.delete("/api/debts/delete-debt", {
        data: payload,
      });
      return data;
    },
    onSuccess: () => {
      dispatch(
        showAlert({
          type: "success",
          message: "Debt successfully deleted",
        }),
      );

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      dispatch(
        showAlert({
          type: "failed",
          message: error.message || "Failed to delete debt. Please try again.",
        }),
      );

      console.error("Error deleting debt:", error);
    },
  });
}
