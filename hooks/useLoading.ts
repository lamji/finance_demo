import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { clearLoading, setLoading } from "@/store/features/loadingSlice";

export function useLoading(key: string) {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.loading[key] || false,
  );

  const startLoading = () => {
    dispatch(setLoading({ key, isLoading: true }));
  };

  const stopLoading = () => {
    dispatch(setLoading({ key, isLoading: false }));
  };

  const clearLoadingState = () => {
    dispatch(clearLoading(key));
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    clearLoadingState,
  };
}
