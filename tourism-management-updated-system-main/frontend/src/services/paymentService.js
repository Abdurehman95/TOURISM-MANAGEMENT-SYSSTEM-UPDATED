import { api } from './api';

// Client-side helper to initiate Chapa payments via your backend.
// IMPORTANT: Do NOT call Chapa with the secret key from the frontend. Your backend must proxy/initialize.

export const paymentService = {
  async createChapaPayment(payload) {
    return await api.post('/payments/chapa/create', payload);
  },

  async verifyChapaPayment(txRef) {
    return await api.get(`/payments/chapa/verify/${txRef}`);
  }
};
