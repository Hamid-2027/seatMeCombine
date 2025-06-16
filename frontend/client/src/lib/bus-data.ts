// This file contains the imported data structure from the attached assets
// It serves as a reference for the data types and structure

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

export interface BusRoute {
  id: string;
  from: string;
  to: string;
  distance: string;
  estimatedDuration: string;
  availableBusTypes: string[];
  isPopular: boolean;
  companyIds: string[];
}

export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface DroppingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

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
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
  features: string[];
  cancellationPolicy: string;
}

// Sample data for reference (this would typically come from the API)
export const sampleBusCompanies: BusCompany[] = [
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
    services: [
      'Premium Bus Service',
      'Business Class Service',
      'Cargo Service',
      'Online Booking',
      'Home Delivery of Tickets',
      'Terminal Lounges'
    ],
    fleetSize: 120,
    routesCovered: ['Lahore-Islamabad', 'Lahore-Karachi', 'Islamabad-Peshawar', 'Karachi-Hyderabad'],
    ratings: {
      overall: 4.7,
      comfort: 4.8,
      punctuality: 4.6,
      cleanliness: 4.9,
      staffBehavior: 4.5,
      reviewCount: 12500
    },
    certifications: ['ISO 9001:2015', 'Pakistan Tourism Development Corporation Approved'],
    busTypes: ['Premium', 'Business', 'Standard']
  }
];
