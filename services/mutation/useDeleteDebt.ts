import { useLoading } from "@/hooks/useLoading"; // Import loading hook
import { triggerRefresh } from "@/store/features/notificationSlice";
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
  const { startLoading, stopLoading } = useLoading("deleteDebt"); // Initialize loading hook

  return useMutation({
    mutationFn: async (payload: DeleteDebtPayload) => {
      startLoading(); // Start loading when mutation begins
      try {
        const { data } = await api.delete("/api/debts/delete-debt", {
          data: payload,
        });
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      stopLoading(); // Stop loading on success
      dispatch(
        showAlert({
          type: "success",
          message: "Debt successfully deleted",
        }),
      );

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      dispatch(triggerRefresh());
    },
    onError: (error: Error) => {
      stopLoading(); // Stop loading on error
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
