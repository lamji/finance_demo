// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Guest Login Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface GuestLoginResponse {
  token: string;
  user: User;
  message?: string;
  performance?: {
    executionTime: string;
  };
}

// Payment Types
export interface PaymentMutationParams {
  debtId: string;
  paymentIndex: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
