import type { BusCompany } from "@shared/schema";

import apiClient from "./index";

const endpoint = "/bus-companies";

/**
 * Fetches all bus companies.
 */
export const getBusCompanies = async (): Promise<BusCompany[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single bus company by its ID.
 */
export const getBusCompanyById = async (id: string): Promise<BusCompany> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};


