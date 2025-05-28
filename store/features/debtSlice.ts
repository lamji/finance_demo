import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Debt {
  id: string;
  bank: string;
  totalDebt: string;
  monthlyPayment: string;
  term: string;
  termType: "months" | "years";
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  remaining_balance: number;
  total_paid: number;
}

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error: string | null;
  editingDebt: (Debt & { type: "for_update" }) | null;
}

const initialState: DebtState = {
  debts: [],
  loading: false,
  error: null,
  editingDebt: null,
};

const debtSlice = createSlice({
  name: "debt",
  initialState,
  reducers: {
    addDebt: (state, action: PayloadAction<Debt>) => {
      state.debts.push(action.payload);
    },
    updateDebt: (state, action: PayloadAction<Debt>) => {
      const index = state.debts.findIndex(
        (debt) => debt.id === action.payload.id,
      );
      if (index !== -1) {
        state.debts[index] = action.payload;
      }
    },
    deleteDebt: (state, action: PayloadAction<string>) => {
      state.debts = state.debts.filter((debt) => debt.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEditingDebt: (
      state,
      action: PayloadAction<{ id: string; type: "for_update" } | (Debt & { type: "for_update" })>,
    ) => {
      if ('bank' in action.payload) {
        // If full debt data is provided, use it
        state.editingDebt = action.payload;
      } else {
        // If only id is provided, find the debt in the list
        const debt = state.debts.find(d => d.id === action.payload.id);
        if (debt) {
          state.editingDebt = { ...debt, type: 'for_update' };
        } else {
          state.editingDebt = null;
        }
      }
    },
    clearEditingDebt: (state) => {
      state.editingDebt = null;
    },
  },
});

export const {
  addDebt,
  updateDebt,
  deleteDebt,
  setLoading,
  setError,
  setEditingDebt,
  clearEditingDebt,
} = debtSlice.actions;
export default debtSlice.reducer;
