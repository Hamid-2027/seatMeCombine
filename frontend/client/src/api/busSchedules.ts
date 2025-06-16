import type { BusSchedule } from "@shared/schema";
import apiClient from './index';

const endpoint = '/busSchedules';

/**
 * Fetches all bus schedules.
 */
export const getBusSchedules = async (): Promise<BusSchedule[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single bus schedule by its ID.
 */
export const getBusScheduleById = async (id: string): Promise<BusSchedule> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new bus schedule.
 */
export const createBusSchedule = async (scheduleData: Omit<BusSchedule, 'id'>): Promise<BusSchedule> => {
  const response = await apiClient.post(endpoint, scheduleData);
  return response.data;
};

/**
 * Updates an existing bus schedule.
 */
export const updateBusSchedule = async (id: string, scheduleData: Partial<BusSchedule>): Promise<BusSchedule> => {
  const response = await apiClient.put(`${endpoint}/${id}`, scheduleData);
  return response.data;
};

/**
 * Deletes a bus schedule.
 */
export const deleteBusSchedule = async (id: string): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
