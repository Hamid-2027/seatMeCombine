import apiClient from './index';

export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  icon: string;
  isPopular: boolean;
  processingFee: number;
  processingTime: string;
}

const endpoint = '/payment-methods';

/**
 * Fetches all payment methods.
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single payment method by its ID.
 */
export const getPaymentMethodById = async (id: string | number): Promise<PaymentMethod> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new payment method.
 */
export const createPaymentMethod = async (methodData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  const response = await apiClient.post(endpoint, methodData);
  return response.data;
};

/**
 * Updates an existing payment method.
 */
export const updatePaymentMethod = async (id: string | number, methodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const response = await apiClient.put(`${endpoint}/${id}`, methodData);
  return response.data;
};

/**
 * Deletes a payment method.
 */
export const deletePaymentMethod = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
