import apiClient from './index';

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_OPERATOR = 'CANCELLED_BY_OPERATOR',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  RESCHEDULED = 'RESCHEDULED',
}

export interface Passenger {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  seatNumber: string;
  bookedById: string;
}

export interface Point {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  busId: string;
  routeId: string;
  passengers: Passenger[];
  totalAmount: number;
  currency: string;
  bookingDate: string; // ISO date string
  paymentMethodId: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus | string;
  seatsBooked: string[];
  boardingPoint: Point;
  droppingPoint: Point;
}

const endpoint = '/bookings';

/**
 * Fetches all bookings.
 */
export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetches a single booking by its ID.
 */
export const getBookingById = async (id: string | number): Promise<Booking> => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * Creates a new booking.
 */
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
  const response = await apiClient.post(endpoint, bookingData);
  return response.data;
};

/**
 * Updates an existing booking.
 */
export const updateBooking = async (id: string | number, bookingData: Partial<Booking>): Promise<Booking> => {
  const response = await apiClient.put(`${endpoint}/${id}`, bookingData);
  return response.data;
};

/**
 * Deletes a booking.
 */
export const deleteBooking = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${endpoint}/${id}`);
};
