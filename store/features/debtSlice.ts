import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Debt {
  id: string;
  bank: string;
  totalDebt: string;
  monthlyPayment: string;
  term: string;
  termType: 'months' | 'years';
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error: string | null;
}

const initialState: DebtState = {
  debts: [],
  loading: false,
  error: null,
};

const debtSlice = createSlice({
  name: 'debt',
  initialState,
  reducers: {
    addDebt: (state, action: PayloadAction<Debt>) => {
      state.debts.push(action.payload);
    },
    updateDebt: (state, action: PayloadAction<Debt>) => {
      const index = state.debts.findIndex(debt => debt.id === action.payload.id);
      if (index !== -1) {
        state.debts[index] = action.payload;
      }
    },
    deleteDebt: (state, action: PayloadAction<string>) => {
      state.debts = state.debts.filter(debt => debt.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addDebt, updateDebt, deleteDebt, setLoading, setError } = debtSlice.actions;
export default debtSlice.reducer;
