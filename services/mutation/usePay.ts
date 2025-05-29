import { useAuthToken } from "@/hooks/useAuthToken";
import { triggerRefresh } from "@/store/features/notificationSlice";
import { showAlert } from "@/store/features/sliceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "../api";
import { PaymentMutationParams } from "../types";

export const usePay = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (params: PaymentMutationParams) => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await api.post(
        "/api/debts/payment",
        {
          debtId: params.debtId,
          paymentIndex: params.paymentIndex,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const { data, status } = response;

      // Check for error property in response data or non-200 status
      if (status !== 200 || data?.error) {
        console.error(
          "Payment failed:",
          data?.error || `Unexpected status code: ${status}`,
        );
        throw new Error(data?.error || `Unexpected status code: ${status}`);
      }

      return data;
    },
    onSuccess: (data) => {
      dispatch(
        showAlert({
          type: "success",
          message: "Your payment has been processed successfully.",
        }),
      );
      dispatch(triggerRefresh());
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Payment mutation failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unknown error occurred during payment";
      dispatch(showAlert({ type: "failed", message: errorMessage }));
    },
  });
};
