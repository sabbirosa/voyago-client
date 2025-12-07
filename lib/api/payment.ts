import { apiFetch } from "./client";

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
      withCredentials: true,
    });
  },

  getPaymentByBooking: async (bookingId: string): Promise<PaymentResponse> => {
    return apiFetch<PaymentResponse>(`/payments/booking/${bookingId}`, {
      method: "GET",
      withCredentials: true,
    });
  },
};
