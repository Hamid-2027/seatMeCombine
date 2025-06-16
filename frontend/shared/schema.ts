export interface Seat {
  id: string;
  seatNumber: string;
  isAvailable: boolean;
}

export interface SeatLayout {
  id: string;
  name: string;
  rows: number;
  columns: number;
  layout?: { [key: string]: (string | null)[] };
  seats: Seat[];
}

export interface Bus {
  id: string;
  name: string;
  registrationNumber: string;
  companyId: string;
  busType: string;
  manufacturingYear: number;
  features: string[];
  seatLayout: SeatLayout;
  totalSeats: number;
  status: string;
  certifications: string;
  additionalFeatures: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

export interface Ratings {
  overall: number;
  comfort: number;
  punctuality: number;
  cleanliness: number;
  staffBehavior: number;
  reviewCount: number;
}

export interface BusCompany {
  id: string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  contactInfo: ContactInfo;
  services: string[];
  fleetSize: number;
  routesCovered: string[];
  ratings: Ratings;
  certifications: string[];
  busTypes: string[];
}

export enum ScheduleStatus {
  ON_TIME = 'ON_TIME',
  DELAYED = 'DELAYED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED'
}

export interface ScheduledSeat {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  type: string;
  price: number;
  currency: string;
  isHandicapped: boolean;
  status: SeatStatus;
  gender?: 'MALE' | 'FEMALE';
  passengerId?: string;
}

export interface ScheduleSeatLayout {
  layoutId: string;
  name: string;
  rows: number;
  columns: number;
  layout: { [key: string]: string[] };
  seats: ScheduledSeat[];
}

export interface BusSchedule {
  id: string;
  routeId: string;
  companyId: string;
  departureTime: string;
  arrivalTime: string;
  busId: string;
  driverId?: string;
  fare: number;
  currency: string;
  status: ScheduleStatus;
  availableSeats?: number;
  amenities?: string[];
  seatLayout: ScheduleSeatLayout;
}
