import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AlertState = {
  visible: boolean;
  type: "success" | "failed";
  message: string;
};

const initialState: AlertState = {
  visible: false,
  type: "success",
  message: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{ type: "success" | "failed"; message: string }>,
    ) => {
      state.visible = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    hideAlert: (state) => {
      state.visible = false;
      state.message = "";
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
