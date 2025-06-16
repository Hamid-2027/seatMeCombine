
  // =============================================
  // BUS COMPANY PROFILES
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
      overall: number; // Out of 5
      comfort: number;
      punctuality: number;
      cleanliness: number;
      staffBehavior: number;
      reviewCount: number;
    };
    certifications: string[];
    busTypes: string[];
  }

  export const busCompanies: BusCompany[] = [
    {
      id: 'company1',
      name: 'Daewoo Pakistan',
      logo: 'assets/images/companies/daewoo.png',
      description: 'Daewoo Express is Pakistan\'s first and largest business class bus service operator. Since its inception in 1999, the company has been providing safe, comfortable, and reliable transportation services across Pakistan.',
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
    },
    {
      id: 'company2',
      name: 'Faisal Movers',
      logo: 'assets/images/companies/faisal.png',
      description: 'Faisal Movers is one of the leading transport companies in Pakistan, providing quality bus services since 2003. The company focuses on passenger comfort and safety.',
      foundedYear: 2003,
      headquarters: 'Lahore, Pakistan',
      contactInfo: {
        email: 'info@faisalmovers.com',
        phone: '+92-42-111-365-365',
        website: 'www.faisalmovers.com',
        socialMedia: {
          facebook: 'facebook.com/FaisalMovers',
          twitter: 'twitter.com/FaisalMovers'
        }
      },
      services: [
        'Business Class Service',
        'Standard Bus Service',
        'Cargo Service',
        'Online Booking',
        'Home Delivery of Tickets'
      ],
      fleetSize: 85,
      routesCovered: ['Lahore-Islamabad', 'Lahore-Faisalabad', 'Islamabad-Peshawar'],
      ratings: {
        overall: 4.3,
        comfort: 4.2,
        punctuality: 4.5,
        cleanliness: 4.4,
        staffBehavior: 4.1,
        reviewCount: 8750
      },
      certifications: ['Pakistan Tourism Development Corporation Approved'],
      busTypes: ['Business', 'Standard']
    },
    {
      id: 'company3',
      name: 'Skyways',
      logo: 'assets/images/companies/skyways.png',
      description: 'Skyways is a growing bus service provider in Pakistan, known for its economical fares and reliable service on various routes across the country.',
      foundedYear: 2010,
      headquarters: 'Rawalpindi, Pakistan',
      contactInfo: {
        email: 'info@skyways.pk',
        phone: '+92-51-111-759-759',
        website: 'www.skyways.pk',
        socialMedia: {
          facebook: 'facebook.com/SkywaysPK'
        }
      },
      services: [
        'Standard Bus Service',
        'Online Booking',
        'Cargo Delivery'
      ],
      fleetSize: 45,
      routesCovered: ['Islamabad-Peshawar', 'Rawalpindi-Lahore', 'Islamabad-Murree'],
      ratings: {
        overall: 3.9,
        comfort: 3.7,
        punctuality: 4.1,
        cleanliness: 3.8,
        staffBehavior: 4.0,
        reviewCount: 3200
      },
      certifications: [],
      busTypes: ['Standard']
    },
    {
      id: 'company4',
      name: 'Bilal Travels',
      logo: 'assets/images/companies/bilal.png',
      description: 'Bilal Travels specializes in luxury bus services between major cities in Pakistan, with a focus on premium amenities and exceptional customer service.',
      foundedYear: 2008,
      headquarters: 'Karachi, Pakistan',
      contactInfo: {
        email: 'info@bilaltravels.com.pk',
        phone: '+92-21-111-245-245',
        website: 'www.bilaltravels.com.pk',
        socialMedia: {
          facebook: 'facebook.com/BilalTravelsPK',
          instagram: 'instagram.com/bilaltravels_official'
        }
      },
      services: [
        'Premium Bus Service',
        'VIP Lounge Access',
        'Online Booking',
        'Refreshment Service',
        'WiFi on Board'
      ],
      fleetSize: 30,
      routesCovered: ['Karachi-Hyderabad', 'Karachi-Lahore', 'Karachi-Islamabad'],
      ratings: {
        overall: 4.6,
        comfort: 4.8,
        punctuality: 4.3,
        cleanliness: 4.7,
        staffBehavior: 4.6,
        reviewCount: 5800
      },
      certifications: ['ISO 9001:2015'],
      busTypes: ['Premium']
    },
    {
      id: 'company5',
      name: 'Kohistan Express',
      logo: 'assets/images/companies/kohistan.png',
      description: 'Kohistan Express provides reliable bus services across Pakistan with a focus on business class travel and passenger comfort at affordable rates.',
      foundedYear: 2005,
      headquarters: 'Islamabad, Pakistan',
      contactInfo: {
        email: 'info@kohistanexpress.pk',
        phone: '+92-51-111-333-444',
        website: 'www.kohistanexpress.pk',
        socialMedia: {
          facebook: 'facebook.com/KohistanExpressPK'
        }
      },
      services: [
        'Business Class Service',
        'Standard Bus Service',
        'Online Booking',
        'Snack Service'
      ],
      fleetSize: 60,
      distance: '190 km',
      estimatedDuration: '2h 30m',
      availableBusTypes: ['Standard', 'Business'],
      isPopular: false,
      companyIds: ['company1', 'company3', 'company5']
    },
    {
      id: 'route4',
      from: 'Karachi',
      to: 'Hyderabad',
      distance: '160 km',
      estimatedDuration: '2h 15m',
      availableBusTypes: ['Standard', 'Business', 'Premium'],
      isPopular: true,
      companyIds: ['company1', 'company4']
    },
    {
      id: 'route5',
      from: 'Lahore',
      to: 'Faisalabad',
      distance: '180 km',
      estimatedDuration: '2h 45m',
      availableBusTypes: ['Standard', 'Business'],
      isPopular: false,
      companyIds: ['company2', 'company5']
    }
  ];
  
  // BUS SCHEDULES (STEP 1 & 2: ROUTE & DATE/TIME SELECTION)

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
  
  export const busSchedules: BusSchedule[] = [
    {
      id: 'schedule1',
      routeId: 'route1',
      busId: 'bus1',
      companyId: 'company1',
      departureTime: '08:00 AM',
      arrivalTime: '12:30 PM',
      date: '2025-05-27',
      busType: 'Premium',
      availableSeats: 24,
      totalSeats: 36,
      fare: 2500,
      currency: 'PKR',
      boardingPoints: [
        {
          id: 'bp1',
          name: 'Daewoo Terminal Lahore',
          address: 'Thokar Niaz Baig, Lahore',
          time: '07:30 AM',
          landmark: 'Near Thokar Niaz Baig Flyover',
          coordinates: {
            latitude: 31.4846,
            longitude: 74.2999
          }
        },
        {
          id: 'bp2',
          name: 'Daewoo Terminal Kalma Chowk',
          address: 'Kalma Chowk, Lahore',
          time: '07:45 AM',
          landmark: 'Near Kalma Chowk Flyover',
          coordinates: {
            latitude: 31.5102,
            longitude: 74.3282
          }
        }
      ],
      droppingPoints: [
        {
          id: 'dp1',
          name: 'Daewoo Terminal Islamabad',
          address: 'I-8 Markaz, Islamabad',
          time: '12:30 PM',
          landmark: 'Near Centaurus Mall',
          coordinates: {
            latitude: 33.6844,
            longitude: 73.0479
          }
        }
      ],
      features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Refreshments', 'Reclining Seats'],
      cancellationPolicy: '100% refund if cancelled 24 hours before departure, 50% refund if cancelled 12 hours before departure, no refund otherwise.'
    },
    {
      id: 'schedule2',
      routeId: 'route1',
      busId: 'bus2',
      companyId: 'company2',
      departureTime: '10:30 AM',
      arrivalTime: '03:00 PM',
      date: '2025-05-27',
      busType: 'Business',
      availableSeats: 18,
      totalSeats: 30,
      fare: 1800,
      currency: 'PKR',
      boardingPoints: [
        {
          id: 'bp3',
          name: 'Faisal Movers Terminal',
          address: 'Ferozpur Road, Lahore',
          time: '10:00 AM',
          landmark: 'Near Qainchi Flyover',
          coordinates: {
            latitude: 31.4701,
            longitude: 74.2701
          }
        }
      ],
      droppingPoints: [
        {
          id: 'dp2',
          name: 'Faisal Movers Islamabad Terminal',
          address: 'Faizabad, Islamabad',
          time: '03:00 PM',
          landmark: 'Near Faizabad Metro Station',
          coordinates: {
            latitude: 33.6601,
            longitude: 73.0769
          }
        }
      ],
      features: ['WiFi', 'Air Conditioning', 'Snacks', 'Adjustable Seats'],
      cancellationPolicy: '75% refund if cancelled 24 hours before departure, 25% refund if cancelled 12 hours before departure, no refund otherwise.'
    },
    {
      id: 'schedule3',
      routeId: 'route1',
      busId: 'bus3',
      companyId: 'company3',
      departureTime: '02:00 PM',
      arrivalTime: '06:30 PM',
      date: '2025-05-27',
      busType: 'Standard',
      availableSeats: 35,
      totalSeats: 45,
      fare: 1200,
      currency: 'PKR',
      boardingPoints: [
        {
          id: 'bp4',
          name: 'Skyways Terminal',
          address: 'Multan Road, Lahore',
          time: '01:30 PM',
          landmark: 'Near Chauburji',
          coordinates: {
            latitude: 31.5582,
            longitude: 74.3088
          }
        }
      ],
      droppingPoints: [
        {
          id: 'dp3',
          name: 'Skyways Islamabad Terminal',
          address: 'Pirwadhai, Rawalpindi',
          time: '06:30 PM',
          landmark: 'Near Pirwadhai Mor',
          coordinates: {
            latitude: 33.6510,
            longitude: 73.0329
          }
        }
      ],
      features: ['Air Conditioning', 'Basic Refreshments'],
      cancellationPolicy: '50% refund if cancelled 24 hours before departure, no refund otherwise.'
    },
    {
      id: 'schedule4',
      routeId: 'route2',
      busId: 'bus4',
      companyId: 'company4',
      departureTime: '09:00 PM',
      arrivalTime: '12:20 PM',
      date: '2025-05-28',
      busType: 'Premium',
      availableSeats: 20,
      totalSeats: 36,
      fare: 5500,
      currency: 'PKR',
      boardingPoints: [
        {
          id: 'bp5',
          name: 'Bilal Travels Terminal',
          address: 'Shahrah-e-Faisal, Karachi',
          time: '08:30 PM',
          landmark: 'Near Star Gate',
          coordinates: {
            latitude: 24.8918,
            longitude: 67.1380
          }
        }
      ],
      droppingPoints: [
        {
          id: 'dp4',
          name: 'Bilal Travels Lahore Terminal',
          address: 'Badami Bagh, Lahore',
          time: '12:20 PM',
          landmark: 'Near Badami Bagh Bus Terminal',
          coordinates: {
            latitude: 31.5883,
            longitude: 74.3059
          }
        }
      ],
      features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Premium Refreshments', 'Fully Reclining Seats', 'Personal Entertainment'],
      cancellationPolicy: '100% refund if cancelled 48 hours before departure, 75% refund if cancelled 24 hours before departure, 50% refund if cancelled 12 hours before departure, no refund otherwise.'
    },
    {
      id: 'schedule5',
      routeId: 'route2',
      busId: 'bus5',
      companyId: 'company5',
      departureTime: '10:00 PM',
      arrivalTime: '01:20 PM',
      date: '2025-05-28',
      busType: 'Business',
      availableSeats: 15,
      totalSeats: 30,
      fare: 4200,
      currency: 'PKR',
      boardingPoints: [
        {
          id: 'bp6',
          name: 'Kohistan Express Terminal',
          address: 'North Nazimabad, Karachi',
          time: '09:30 PM',
          landmark: 'Near Nagan Chowrangi',
          coordinates: {
            latitude: 24.9577,
            longitude: 67.0376
          }
        }
      ],
      droppingPoints: [
        {
          id: 'dp5',
          name: 'Kohistan Express Lahore Terminal',
          address: 'Thokar Niaz Baig, Lahore',
          time: '01:20 PM',
          landmark: 'Near Thokar Niaz Baig Flyover',
          coordinates: {
            latitude: 31.4846,
            longitude: 74.2999
          }
        }
      ],
      features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Snack Service', 'Semi-Reclining Seats'],
      cancellationPolicy: '75% refund if cancelled 24 hours before departure, 25% refund if cancelled 12 hours before departure, no refund otherwise.'
    }
  ];
  
// BUS DETAILS AND SEAT CONFIGURATION (STEP 3: SEAT SELECTION)
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

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum DocumentType {
  CNIC = 'CNIC',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE'
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

export interface PassengerDetail {
  id: string;
  name: string;
  gender: Gender;
  seatNumber: string;
  bookedById: string; // ID of the user who booked this seat
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'easypaisa' | 'jazzcash' | 'bank_transfer';
  name: string;
  icon: any; // Image source
  isPopular: boolean;
  processingFee?: number;
  processingTime?: string;
}

export const seatLayouts: SeatLayoutTemplate[] = [
  {
    layoutId: 'layout_2x2_business',
    name: '2x2 Business Class',
    rows: 10,
    columns: 4,
    layout: [
      ['1A', '1B', '', '1C'],
      ['2A', '2B', '', '2C'],
      ['3A', '3B', '', '3C'],
      ['4A', '4B', '', '4C'],
      ['5A', '5B', '', '5C'],
      ['6A', '6B', '', '6C'],
      ['7A', '7B', '', '7C'],
      ['8A', '8B', '', '8C'],
      ['9A', '9B', '', '9C'],
      ['10A', '10B', '', '10C']
    ],
    seats: [
      {
        id: 'seat1-layout_2x2_business',
        seatNumber: '1A',
        row: 0,
        column: 0,
        type: 'window',
        price: 1800,
        currency: 'PKR',
        isHandicapped: false,
        status: SeatStatus.AVAILABLE
      },
      {
        id: 'seat2-layout_2x2_business',
        seatNumber: '1B',
        row: 0,
        column: 1,
        type: 'aisle',
        price: 1800,
        currency: 'PKR',
        isHandicapped: false,
        status: SeatStatus.AVAILABLE
      },
      {
        id: 'seat3-layout_2x2_business',
        seatNumber: '1C',
        row: 0,
        column: 3,
        type: 'window',
        price: 1800,
        currency: 'PKR',
        isHandicapped: false,
        status: SeatStatus.AVAILABLE
      }
    ]
  }
]

// USER PROFILES
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
  profilePicture?: string;
  savedPassengers: PassengerDetail[];
  savedPaymentMethods: {
    id: string;
    type: string;
    lastFourDigits?: string;
    expiryDate?: string;
    cardHolderName?: string;
    isDefault: boolean;
  }[];
  bookingHistory: {
    id: string;
    from: string;
    to: string;
    date: string;
    status: BookingStatus;
    amount: number;
  }[];
}

export const sampleUserProfile: UserProfile = {
  id: 'user456',
  name: 'Muhammad Ali',
  email: 'muhammadali@example.com',
  phoneNumber: '+923001234567',
  gender: Gender.MALE,
  dateOfBirth: '1993-05-15',
  address: '123 Main Street, Gulberg',
  city: 'Lahore',
  country: 'Pakistan',
  profilePicture: 'assets/images/profiles/user456.jpg',

  savedPassengers: [
    {
      id: 'passenger1',
      name: 'Muhammad Ali',
      gender: Gender.MALE,
      seatNumber: '1A',
      bookedById: 'user456'
    },
    {
      id: 'passenger2',
      name: 'Fatima Khan',
      gender: Gender.FEMALE,
      seatNumber: '1B',
      bookedById: 'user456'
    }
  ],
  savedPaymentMethods: [
    {
      id: 'pm_user1',
      type: 'credit_card',
      lastFourDigits: '4242',
      expiryDate: '05/28',
      cardHolderName: 'Muhammad Ali',
      isDefault: true
    },
    {
      id: 'pm_user2',
      type: 'easypaisa',
      isDefault: false
    }
  ],
  bookingHistory: [
    {
      id: 'booking123',
      from: 'Lahore',
      to: 'Islamabad',
      date: '2025-05-27',
      status: BookingStatus.CONFIRMED,
      amount: 5000
    },
    {
      id: 'booking101',
      from: 'Lahore',
      to: 'Karachi',
      date: '2025-04-15',
      status: BookingStatus.COMPLETED,
      amount: 8500
    }
  ]
}
  
  // API ENDPOINTS =============================================
  export const API_ENDPOINTS = {
    // Bus Routes
    GET_BUS_ROUTES: '/api/bus-routes',
    GET_POPULAR_ROUTES: '/api/bus-routes?popular=true',
    GET_ROUTE_DETAILS: (routeId: string) => `/api/bus-routes/${routeId}`,
    SEARCH_ROUTES: '/api/bus-routes/search',
    
    // Bus Companies
    GET_BUS_COMPANIES: '/api/bus-companies',
    GET_COMPANY_DETAILS: (companyId: string) => `/api/bus-companies/${companyId}`,
    GET_COMPANY_REVIEWS: (companyId: string) => `/api/bus-companies/${companyId}/reviews`,
    
    // Bus Schedules
    GET_BUS_SCHEDULES: '/api/bus-schedules',
    GET_SCHEDULES_BY_ROUTE: (routeId: string, date: string) => `/api/bus-schedules?routeId=${routeId}&date=${date}`,
    GET_SCHEDULE_DETAILS: (scheduleId: string) => `/api/bus-schedules/${scheduleId}`,
    
    // Bus Details and Seats
    GET_BUS_DETAILS: (busId: string) => `/api/buses/${busId}`,
    GET_BUS_SEAT_AVAILABILITY: (busId: string, scheduleId: string) => `/api/buses/${busId}/seats?scheduleId=${scheduleId}`,
    GET_SEAT_PRICING: (busId: string, scheduleId: string) => `/api/buses/${busId}/seats/pricing?scheduleId=${scheduleId}`,
    BLOCK_SEATS: (busId: string) => `/api/buses/${busId}/seats/block`,
    
    // Boarding & Dropping Points
    GET_BOARDING_POINTS: (scheduleId: string) => `/api/schedules/${scheduleId}/boarding-points`,
    GET_DROPPING_POINTS: (scheduleId: string) => `/api/schedules/${scheduleId}/dropping-points`,
    
    // Passenger Details
    POST_PASSENGER_DETAILS: (bookingId: string) => `/api/bookings/${bookingId}/passengers`,
    GET_SAVED_PASSENGERS: (userId: string) => `/api/users/${userId}/saved-passengers`,
    SAVE_PASSENGER: (userId: string) => `/api/users/${userId}/saved-passengers`,
    DELETE_SAVED_PASSENGER: (userId: string, passengerId: string) => `/api/users/${userId}/saved-passengers/${passengerId}`,
    
    // Bookings
    CREATE_BOOKING: '/api/bookings',
    GET_BOOKING_DETAILS: (bookingId: string) => `/api/bookings/${bookingId}`,
    UPDATE_BOOKING_STATUS: (bookingId: string) => `/api/bookings/${bookingId}/status`,
    CANCEL_BOOKING: (bookingId: string) => `/api/bookings/${bookingId}/cancel`,
    GET_USER_BOOKINGS: (userId: string) => `/api/users/${userId}/bookings`,
    GET_BOOKING_RECEIPT: (bookingId: string) => `/api/bookings/${bookingId}/receipt`,
    
    // Payment
    PROCESS_PAYMENT: '/api/payments',
    GET_PAYMENT_STATUS: (paymentId: string) => `/api/payments/${paymentId}`,
    GET_PAYMENT_METHODS: '/api/payment-methods',
    SAVE_PAYMENT_METHOD: (userId: string) => `/api/users/${userId}/payment-methods`,
    DELETE_PAYMENT_METHOD: (userId: string, methodId: string) => `/api/users/${userId}/payment-methods/${methodId}`,
    INITIATE_REFUND: (bookingId: string) => `/api/bookings/${bookingId}/refund`,
    
    // User Profile
    GET_USER_PROFILE: (userId: string) => `/api/users/${userId}`,
    UPDATE_USER_PROFILE: (userId: string) => `/api/users/${userId}`,
    GET_USER_NOTIFICATIONS: (userId: string) => `/api/users/${userId}/notifications`,
    
    // Reviews & Ratings
    POST_BOOKING_REVIEW: (bookingId: string) => `/api/bookings/${bookingId}/review`,
    GET_USER_REVIEWS: (userId: string) => `/api/users/${userId}/reviews`
  };