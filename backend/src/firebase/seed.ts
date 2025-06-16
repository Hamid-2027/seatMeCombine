import { db } from './config';
import { collection, doc, setDoc } from 'firebase/firestore';
import { busCompanies } from '../types/dataStructure';

export const seedData = async () => {
  try {
    // Seed Bus Companies
    for (const company of busCompanies) {
      await setDoc(doc(db, 'busCompanies', company.id), company);
    }

    // Seed Routes
    const routes = [
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

    for (const route of routes) {
      await setDoc(doc(db, 'routes', route.id), route);
    }

    // Seed Bus Schedules
    const schedules = [
      {
        id: 'schedule1',
        routeId: 'route1',
        busId: 'bus1',
        companyId: 'company1',
        departureTime: '2024-03-20T08:00:00',
        arrivalTime: '2024-03-20T12:30:00',
        date: '2024-03-20',
        busType: 'Premium',
        availableSeats: 24,
        totalSeats: 36,
        fare: 2500,
        currency: 'PKR',
        features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Refreshments'],
        cancellationPolicy: '100% refund if cancelled 24 hours before departure'
      }
    ];

    for (const schedule of schedules) {
      await setDoc(doc(db, 'busSchedules', schedule.id), schedule);
    }

    // Seed Buses
    const buses = [
      {
        id: 'bus1',
        name: 'Daewoo Premium Bus',
        busType: 'Premium',
        registrationNumber: 'LHR-1234',
        operator: 'Daewoo Pakistan',
        companyId: 'company1',
        amenities: ['WiFi', 'USB Charging', 'Air Conditioning', 'Refreshments'],
        seatLayout: {
          layoutId: 'layout_2x2_business',
          name: '2x2 Business Class',
          rows: 10,
          columns: 4,
          layout: [
            ['1A', '1B', '', '1C'],
            ['2A', '2B', '', '2C']
          ],
          seats: [
            {
              id: 'seat1',
              seatNumber: '1A',
              row: 0,
              column: 0,
              type: 'window',
              price: 2500,
              currency: 'PKR',
              isHandicapped: false,
              status: 'AVAILABLE'
            }
          ]
        }
      }
    ];

    for (const bus of buses) {
      await setDoc(doc(db, 'buses', bus.id), bus);
    }

    // Seed User Profiles
    const users = [
      {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+923001234567',
        gender: 'MALE',
        dateOfBirth: '1990-01-01',
        address: '123 Main St',
        city: 'Lahore',
        country: 'Pakistan',
        savedPassengers: [],
        savedPaymentMethods: [],
        bookingHistory: []
      }
    ];

    for (const user of users) {
      await setDoc(doc(db, 'users', user.id), user);
    }

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}; 