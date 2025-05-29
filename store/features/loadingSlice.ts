import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  [key: string]: boolean;
}

const initialState: LoadingState = {};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ key: string; isLoading: boolean }>,
    ) => {
      const { key, isLoading } = action.payload;
      state[key] = isLoading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearAll: () => initialState,
  },
});

export const { setLoading, clearLoading, clearAll } = loadingSlice.actions;
export default loadingSlice.reducer;
