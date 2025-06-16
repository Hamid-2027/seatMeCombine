import apiClient from './index';

// Define refined interfaces based on the backend's sample data.
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED_BY_USER = 'cancelled_by_user',
  CANCELLED_BY_OPERATOR = 'cancelled_by_operator',
  COMPLETED = 'completed',
  MISSED = 'missed',
  RESCHEDULED = 'rescheduled',
}

export interface SavedPassenger {
  id: string;
  name: string;
  gender: Gender;
  seatNumber?: string; // Optional in the saved context
  bookedById: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: string;
  lastFourDigits?: string;
  expiryDate?: string;
  cardHolderName?: string;
  isDefault: boolean;
}

export interface BookingHistoryItem {
  id: string;
  from: string;
  to: string;
  date: string; // Could be a date string
  status: BookingStatus;
  amount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: string; // Date string
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  savedPassengers: SavedPassenger[];
  savedPaymentMethods: SavedPaymentMethod[];
  bookingHistory: BookingHistoryItem[];
}

const endpoint = '/user-profiles';

// --- User Profile CRUD ---

export const getUserProfiles = async (): Promise<UserProfile[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const getUserProfileById = async (id: string | number): Promise<UserProfile> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

export const createUserProfile = async (profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> => {
  const response = await apiClient.post(endpoint, profileData);
  return response.data;
};

export const updateUserProfile = async (id: string | number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await apiClient.put(`${endpoint}/${id}`, profileData);
  return response.data;
};

export const deleteUserProfile = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};

// --- Saved Passengers ---

export const addSavedPassenger = async (userId: string | number, passengerData: Omit<SavedPassenger, 'id'>): Promise<SavedPassenger> => {
  const response = await apiClient.post(`${endpoint}/${userId}/passengers`, passengerData);
  return response.data;
};

export const updateSavedPassenger = async (userId: string | number, passengerId: string | number, passengerData: Partial<SavedPassenger>): Promise<SavedPassenger> => {
  const response = await apiClient.put(`${endpoint}/${userId}/passengers/${passengerId}`, passengerData);
  return response.data;
};

export const deleteSavedPassenger = async (userId: string | number, passengerId: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${userId}/passengers/${passengerId}`);
};

// --- Saved Payment Methods ---

export const addSavedPaymentMethod = async (userId: string | number, pmData: Omit<SavedPaymentMethod, 'id'>): Promise<SavedPaymentMethod> => {
  const response = await apiClient.post(`${endpoint}/${userId}/payment-methods`, pmData);
  return response.data;
};

export const updateSavedPaymentMethod = async (userId: string | number, pmId: string | number, pmData: Partial<SavedPaymentMethod>): Promise<SavedPaymentMethod> => {
  const response = await apiClient.put(`${endpoint}/${userId}/payment-methods/${pmId}`, pmData);
  return response.data;
};

export const deleteSavedPaymentMethod = async (userId: string | number, pmId: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${userId}/payment-methods/${pmId}`);
};
