// Bus Company Types
export interface BusCompany {
  id: string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  services: string[];
  fleetSize: number;
  routesCovered: string[];
  ratings: {
    overall: number;
    comfort: number;
    punctuality: number;
    cleanliness: number;
    staffBehavior: number;
    reviewCount: number;
  };
  certifications: string[];
  busTypes: string[];
}

// Route Types
export interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  estimatedDuration: string;
  availableBusTypes: string[];
  isPopular: boolean;
  companyIds: string[];
}

// Bus Schedule Types
export interface BusSchedule {
  id: string;
  routeId: string;
  busId: string;
  companyId: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  busType: string;
  availableSeats: number;
  totalSeats: number;
  fare: number;
  currency: string;
  features: string[];
  cancellationPolicy: string;
}

// Bus Types
export interface Bus {
  id: string;
  name: string;
  busType: string;
  registrationNumber: string;
  operator: string;
  companyId: string;
  amenities: string[];
  seatLayout: SeatLayoutTemplate;
}

export interface SeatLayoutTemplate {
  layoutId: string;
  name: string;
  rows: number;
  columns: number;
  layout: string[][];
  seats: Seat[];
}

export interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  type: 'window' | 'aisle' | 'middle';
  price: number;
  currency: string;
  isHandicapped: boolean;
  status: SeatStatus;
}

// User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  savedPassengers: PassengerDetail[];
  savedPaymentMethods: PaymentMethod[];
  bookingHistory: Booking[];
}

export interface PassengerDetail {
  id: string;
  name: string;
  gender: Gender;
  seatNumber: string;
  bookedById: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  lastFourDigits?: string;
  expiryDate?: string;
  cardHolderName?: string;
  isDefault: boolean;
}

export interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  status: BookingStatus;
  amount: number;
}

// Enums
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED'
}

// Sample Data
export const busCompanies: BusCompany[] = [
  {
    id: 'company1',
    name: 'Daewoo Pakistan',
    logo: 'assets/images/companies/daewoo.png',
    description: 'Daewoo Express is Pakistan\'s first and largest business class bus service operator.',
    foundedYear: 1999,
    headquarters: 'Lahore, Pakistan',
    contactInfo: {
      email: 'info@daewoo.com.pk',
      phone: '+92-42-111-007-008',
      website: 'www.daewoo.com.pk',
      socialMedia: {
        facebook: 'facebook.com/DaewooExpressPakistan',
        twitter: 'twitter.com/DaewooExpress',
        instagram: 'instagram.com/daewooexpress_official'
      }
    },
    services: ['Premium Bus Service', 'Business Class Service', 'Online Booking'],
    fleetSize: 120,
    routesCovered: ['Lahore-Islamabad', 'Lahore-Karachi'],
    ratings: {
      overall: 4.7,
      comfort: 4.8,
      punctuality: 4.6,
      cleanliness: 4.9,
      staffBehavior: 4.5,
      reviewCount: 12500
    },
    certifications: ['ISO 9001:2015'],
    busTypes: ['Premium', 'Business', 'Standard']
  }
];

export const routes: Route[] = [
  {
    id: 'route1',
    from: 'Lahore',
    to: 'Islamabad',
    distance: '380 km',
    estimatedDuration: '4h 30m',
    availableBusTypes: ['Standard', 'Business', 'Premium'],
    isPopular: true,
    companyIds: ['company1', 'company2', 'company3']
  },
  {
    id: 'route2',
    from: 'Karachi',
    to: 'Lahore',
    distance: '1200 km',
    estimatedDuration: '16h 20m',
    availableBusTypes: ['Standard', 'Business', 'Premium'],
    isPopular: true,
    companyIds: ['company1', 'company4', 'company5']
  }
]; 