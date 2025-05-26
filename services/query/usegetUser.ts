import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export interface MonthlyPayment {
  amount: number;
  status: "pending" | "paid" | string;
  due_date: string; // ISO date string
  _id: string;
}

export interface Debt {
  bank: string;
  totalDebt: number;
  remaining_balance: number;
  total_paid: number;
  monthly_due: number;
  term_length: number;
  term_type: "months" | "years" | string;
  start_date: string;
  isActive: boolean;
  due_date: string;
  monthly_payments: MonthlyPayment[];
  _id: string;
  transactions: any[]; // You can replace `any` with a defined type if you have transaction details
}

export interface SubscriptionFeatures {
  cloudBackup: boolean;
  prioritySupport: boolean;
  maxDebts: number;
  analytics: boolean;
  isSharedData: boolean;
}

export interface Subscription {
  features: SubscriptionFeatures;
  type: "demo" | "free" | "premium" | string;
  from: string;
  due: string;
  monthly_payment: number;
  status: "active" | "inactive" | string;
  _id: string;
}

export interface DebtsData {
  debtsList: Debt[];
}

export interface UserResponse {
  data: DebtsData;
  _id: string;
  name: string;
  email: string;
  authType: "guest" | "user" | string;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isGuest: boolean;
}

async function fetchUser(): Promise<UserResponse> {
  const response = await api.get("/api/user");
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to fetch user");
  }
  return response.data;
}

export function useGetUser() {
  return useQuery<UserResponse, Error>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });
}
