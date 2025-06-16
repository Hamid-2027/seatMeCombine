import apiClient from './index';

import type { SeatLayout } from "@shared/schema";

const endpoint = '/seatLayouts';

/**
 * Fetches all seat layouts.
 */
export const getSeatLayouts = async (): Promise<SeatLayout[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single seat layout by its ID.
 */
export const getSeatLayoutById = async (id: string | number): Promise<SeatLayout> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new seat layout.
 */
export const createSeatLayout = async (layoutData: Omit<SeatLayout, 'id'>): Promise<SeatLayout> => {
  const response = await apiClient.post(endpoint, layoutData);
  return response.data;
};

/**
 * Updates an existing seat layout.
 */
export const updateSeatLayout = async (id: string | number, layoutData: Partial<SeatLayout>): Promise<SeatLayout> => {
  const response = await apiClient.put(`${endpoint}/${id}`, layoutData);
  return response.data;
};

/**
 * Deletes a seat layout.
 */
export const deleteSeatLayout = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
