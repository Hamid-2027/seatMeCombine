import apiClient from './index';
import type { BusRoute } from '@shared/schema';

const endpoint = '/busRoutes';

/**
 * Fetches all bus routes.
 */
export const getBusRoutes = async (): Promise<BusRoute[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single bus route by its ID.
 */
export const getBusRouteById = async (id: string | number): Promise<BusRoute> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new bus route.
 */
export const createBusRoute = async (routeData: Omit<BusRoute, 'id'>): Promise<BusRoute> => {
  const response = await apiClient.post(endpoint, routeData);
  return response.data;
};

/**
 * Updates an existing bus route.
 */
export const updateBusRoute = async (id: string | number, routeData: Partial<BusRoute>): Promise<BusRoute> => {
  const response = await apiClient.put(`${endpoint}/${id}`, routeData);
  return response.data;
};

/**
 * Deletes a bus route.
 */
export const deleteBusRoute = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
