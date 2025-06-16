const express = require('express');

const BUSES_COLLECTION = 'buses';

// Define SeatStatus enum locally for this module
const SeatStatus = {
    AVAILABLE: 'available',
    BOOKED: 'booked',
    RESERVED: 'reserved', // e.g. for staff or special needs
    BLOCKED: 'blocked', // e.g. for maintenance or social distancing
    UNAVAILABLE: 'unavailable' // General unavailability
};

// Sample Data for Buses (placeholder, as not found in dataStcuture.ts)
const sampleBuses = [
  {
    id: 'bus1',
    name: 'Daewoo Premium Liner 1',
    busType: 'Premium',
    registrationNumber: 'LHR-123',
    operator: 'Daewoo Express',
    companyId: 'company1',
    amenities: ['WiFi', 'USB Charging', 'Air Conditioning', 'Refreshments', 'Reclining Seats'],
    seatLayoutTemplate: { // renamed from seatLayout
      layoutId: 'bus1_layout_premium',
      name: 'Premium 2x1 Layout',
      rows: 8,
      columns: 3,
      layout: { // Map of rows for Firestore compatibility
        "row0": ['1A', '', '1B'],
        "row1": ['2A', '', '2B'],
        "row2": ['3A', '', '3B'],
        "row3": ['4A', '', '4B'],
        "row4": ['5A', '', '5B'],
        "row5": ['6A', '', '6B'],
        "row6": ['7A', '', '7B'],
        "row7": ['8A', '', '8B']
      }
    }
  },
  {
    id: 'bus2',
    name: 'Faisal Movers Business Class 1',
    busType: 'Business',
    registrationNumber: 'LHE-456',
    operator: 'Faisal Movers',
    companyId: 'company2',
    amenities: ['WiFi', 'Air Conditioning', 'Snacks', 'Adjustable Seats'],
    seatLayoutTemplate: { // renamed from seatLayout
      layoutId: 'bus2_layout_business', // Using the layoutId from sampleSeatLayouts for conceptual link
      name: '2x2 Business Class', // Matches name from sampleSeatLayouts
      rows: 10,
      columns: 4,
      layout: { // Map of rows for Firestore compatibility
        "row0": ['1A', '1B', '', '1C'],
        "row1": ['2A', '2B', '', '2C'],
        "row2": ['3A', '3B', '', '3C'],
        "row3": ['4A', '4B', '', '4C'],
        "row4": ['5A', '5B', '', '5C'],
        "row5": ['6A', '6B', '', '6C'],
        "row6": ['7A', '7B', '', '7C'],
        "row7": ['8A', '8B', '', '8C'],
        "row8": ['9A', '9B', '', '9C'],
        "row9": ['10A', '10B', '', '10C']
      }
    }
  }
];

module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // Create a new bus
    router.post('/', async (req, res) => {
      try {
        const busData = req.body;
        // Basic validation
        if (!busData.name || !busData.registrationNumber || !busData.companyId) {
          return res.status(400).send('Missing required fields: name, registrationNumber, companyId');
        }
        // Ensure seatLayout.layout is a map if provided
        // Ensure seatLayoutTemplate.layout is a map if provided
        if (busData.seatLayoutTemplate && Array.isArray(busData.seatLayoutTemplate.layout)) {
            return res.status(400).send('seatLayoutTemplate.layout must be a map of rows, not an array of arrays.');
        }
        // The 'add' method automatically generates a new document ID
        const docRef = await admin.firestore().collection(BUSES_COLLECTION).add(busData);
        // Return the new bus's data, including the auto-generated ID
        res.status(201).json({ id: docRef.id, ...busData });
      } catch (error) {
        console.error(`Error creating bus: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get all buses (and populate if empty)
    router.get('/', async (req, res) => {
      try {
        const snapshot = await admin.firestore().collection(BUSES_COLLECTION).get();
        const buses = [];
        snapshot.forEach(doc => {
          buses.push({
            id: doc.id,
            ...doc.data()
          });
        });
        res.json(buses);
      } catch (error) {
        console.error(`Error fetching buses: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get a specific bus by ID
    router.get('/:id', async (req, res) => {
      try {
        const busId = req.params.id;
        const doc = await admin.firestore().collection(BUSES_COLLECTION).doc(busId).get();
        if (!doc.exists) {
          return res.status(404).send('Bus not found');
        }
        res.json({ id: doc.id, ...doc.data() });
      } catch (error) {
        console.error(`Error fetching bus ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a bus by ID
    router.put('/:id', async (req, res) => {
      try {
        const busId = req.params.id;
        const busData = req.body;
        if (!busData.name || !busData.registrationNumber || !busData.companyId) {
          return res.status(400).send('Missing required fields: name, registrationNumber, companyId');
        }
        // Ensure seatLayout.layout is a map if provided
        // Ensure seatLayoutTemplate.layout is a map if provided
        if (busData.seatLayoutTemplate && Array.isArray(busData.seatLayoutTemplate.layout)) {
            return res.status(400).send('seatLayoutTemplate.layout must be a map of rows, not an array of arrays.');
        }
        await admin.firestore().collection(BUSES_COLLECTION).doc(busId).update(busData);
        res.json({ id: busId, ...busData }); // Return the updated data, assuming busData contains the full updated object
      } catch (error) {
        console.error(`Error updating bus ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a bus by ID
    router.delete('/:id', async (req, res) => {
      try {
        const busId = req.params.id;
        await admin.firestore().collection(BUSES_COLLECTION).doc(busId).delete();
        res.status(200).send(`Bus ${busId} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting bus ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    return router;
};
