import { useAuthToken } from "@/hooks/useAuthToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { PaymentMutationParams } from "../types";

export const usePay = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: async (params: PaymentMutationParams) => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      const { data } = await api.post(
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
      return data;
    },
    onSuccess: () => {
      // Invalidate the user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
