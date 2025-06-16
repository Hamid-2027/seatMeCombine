import type { Bus } from "@shared/schema";

import apiClient from "./index";

const endpoint = "/buses";

/**
 * Fetches all buses.
 */
export const getBuses = async (): Promise<Bus[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single bus by its ID.
 */
export const getBusById = async (id: string): Promise<Bus> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new bus.
 */
export const createBus = async (busData: Omit<Bus, 'id'>): Promise<Bus> => {
  const response = await apiClient.post(endpoint, busData);
  return response.data;
};

/**
 * Updates an existing bus.
 */
export const updateBus = async (id: string, busData: Partial<Bus>): Promise<Bus> => {
  const response = await apiClient.put(`${endpoint}/${id}`, busData);
  return response.data;
};

/**
 * Deletes a bus.
 */
export const deleteBus = async (id: string): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
