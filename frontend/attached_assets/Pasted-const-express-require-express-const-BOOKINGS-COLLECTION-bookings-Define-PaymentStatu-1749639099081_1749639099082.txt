const express = require('express');

const BOOKINGS_COLLECTION = 'bookings';

// Define PaymentStatus enum locally
const PaymentStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

// Sample Data for Bookings
const sampleBookings = [
  {
    id: 'booking789',
    userId: 'user456', // From sampleUserProfile
    scheduleId: 'schedule1', // Assuming a valid scheduleId from sampleBusSchedules
    busId: 'bus1_daewoo', // Assuming a valid busId from sampleBuses
    routeId: 'route1', // Assuming a valid routeId from sampleBusRoutes
    passengers: [
      {
        id: 'passenger_booking789_1',
        name: 'Muhammad Ali',
        gender: 'MALE',
        seatNumber: '3A',
        bookedById: 'user456'
      },
      {
        id: 'passenger_booking789_2',
        name: 'Fatima Khan',
        gender: 'FEMALE',
        seatNumber: '3B',
        bookedById: 'user456'
      }
    ],
    totalAmount: 3600,
    currency: 'PKR',
    bookingDate: new Date().toISOString(),
    paymentMethodId: 'pm_credit_card', // From samplePaymentMethods
    paymentStatus: PaymentStatus.PAID,
    bookingStatus: 'CONFIRMED',
    seatsBooked: ['3A', '3B'],
    boardingPoint: { id: 'bp1', name: 'Kalma Chowk, Lahore' },
    droppingPoint: { id: 'dp1', name: 'Faizabad, Islamabad' }
  }
];

module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // Create a new booking
    router.post('/', async (req, res) => {
      try {
        const bookingData = req.body;
        // Basic validation
        if (!bookingData.userId || !bookingData.scheduleId || !bookingData.passengers || bookingData.passengers.length === 0 || !bookingData.totalAmount) {
          return res.status(400).send('Missing required fields for booking (userId, scheduleId, passengers, totalAmount).');
        }

        bookingData.bookingDate = bookingData.bookingDate || new Date().toISOString();
        bookingData.paymentStatus = bookingData.paymentStatus || PaymentStatus.PENDING;
        bookingData.bookingStatus = bookingData.bookingStatus || 'PENDING'; // Default booking status

        // The 'add' method automatically generates a new document ID
        const docRef = await admin.firestore().collection(BOOKINGS_COLLECTION).add(bookingData);
        // Return the new booking's data, including the auto-generated ID
        res.status(201).json({ id: docRef.id, ...bookingData });
      } catch (error) {
        console.error(`Error creating booking: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get all bookings (and populate if empty)
    router.get('/', async (req, res) => {
      try {
        await populateInitialData(BOOKINGS_COLLECTION, sampleBookings, 'id');
        const snapshot = await admin.firestore().collection(BOOKINGS_COLLECTION).get();
        const bookings = [];
        snapshot.forEach(doc => {
          bookings.push({
            id: doc.id,
            ...doc.data()
          });
        });
        res.json(bookings);
      } catch (error) {
        console.error(`Error fetching bookings: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get a specific booking by ID
    router.get('/:id', async (req, res) => {
      try {
        const bookingId = req.params.id;
        const doc = await admin.firestore().collection(BOOKINGS_COLLECTION).doc(bookingId).get();
        if (!doc.exists) {
          return res.status(404).send('Booking not found');
        }
        res.json({ id: doc.id, ...doc.data() });
      } catch (error) {
        console.error(`Error fetching booking ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a booking by ID (e.g., to update status)
    router.put('/:id', async (req, res) => {
      try {
        const bookingId = req.params.id;
        const bookingData = req.body;

        const validBookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED_BY_USER', 'CANCELLED_BY_OPERATOR', 'COMPLETED', 'MISSED', 'RESCHEDULED'];
        if (bookingData.bookingStatus && !validBookingStatuses.includes(bookingData.bookingStatus)) {
            return res.status(400).send('Invalid bookingStatus value.');
        }
        if (bookingData.paymentStatus && !Object.values(PaymentStatus).includes(bookingData.paymentStatus)) {
            return res.status(400).send('Invalid paymentStatus value.');
        }

        await admin.firestore().collection(BOOKINGS_COLLECTION).doc(bookingId).update(bookingData);
        const updatedDoc = await admin.firestore().collection(BOOKINGS_COLLECTION).doc(bookingId).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
      } catch (error) {
        console.error(`Error updating booking ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a booking by ID
    router.delete('/:id', async (req, res) => {
      try {
        const bookingId = req.params.id;
        await admin.firestore().collection(BOOKINGS_COLLECTION).doc(bookingId).delete();
        res.status(200).send(`Booking ${bookingId} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting booking ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    return router;
};
