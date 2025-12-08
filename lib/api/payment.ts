import { apiFetch } from "./client";
import { getTokens } from "../auth/tokenStorage";

function getAuthHeaders(): HeadersInit {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripePaymentId: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  checkoutUrl?: string;
  clientSecret?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: Payment;
  };
}

export const paymentApi = {
  createPaymentSession: async (bookingId: string): Promise<PaymentResponse> => {
    return apiFetch<PaymentResponse>(`/payments/booking/${bookingId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },

  getPaymentByBooking: async (bookingId: string): Promise<PaymentResponse> => {
    return apiFetch<PaymentResponse>(`/payments/booking/${bookingId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  },
};
