const express = require('express');

const SEAT_LAYOUTS_COLLECTION = 'seatLayouts';

// Sample Data for SeatLayouts (extracted from dataStcuture.ts)
const sampleSeatLayouts = [
  {
    layoutId: 'layout_2x2_business',
    name: '2x2 Business Class',
    rows: 10,
    columns: 4,
    layout: {
      '0': ['S', 'A', 'A', 'S'], // S: Seat, A: Aisle
      '1': ['S', 'A', 'A', 'S'],
      '2': ['S', 'A', 'A', 'S'],
      '3': ['S', 'A', 'A', 'S'],
      '4': ['S', 'A', 'A', 'S'],
      '5': ['S', 'A', 'A', 'S'],
      '6': ['S', 'A', 'A', 'S'],
      '7': ['S', 'A', 'A', 'S'],
      '8': ['S', 'A', 'A', 'S'],
      '9': ['S', 'S', 'S', 'S'] // Last row often has more seats
    },
    seats: [
      { seatNumber: '1A', status: 'AVAILABLE', type: 'WINDOW' },
      { seatNumber: '1B', status: 'AVAILABLE', type: 'AISLE' },
      // ... more seats for row 1
      { seatNumber: '10C', status: 'AVAILABLE', type: 'AISLE' },
      { seatNumber: '10D', status: 'AVAILABLE', type: 'WINDOW' },
    ]
  },
  {
    layoutId: 'layout_1x2_sleeper',
    name: '1x2 Sleeper',
    rows: 8,
    columns: 3,
    layout: {
      '0': ['S', 'A', 'S'],
      '1': ['S', 'A', 'S'],
      '2': ['S', 'A', 'S'],
      '3': ['S', 'A', 'S'],
      '4': ['S', 'A', 'S'],
      '5': ['S', 'A', 'S'],
      '6': ['S', 'A', 'S'],
      '7': ['S', 'A', 'S']
    },
    seats: [
      { seatNumber: 'L1', status: 'AVAILABLE', type: 'LOWER_BERTH' },
      { seatNumber: 'U1', status: 'AVAILABLE', type: 'UPPER_BERTH' },
      // ... more seats
    ]
  }
];

module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // Create a new seat layout
    router.post('/', async (req, res) => {
        try {
            const layoutData = req.body;
            // Basic validation
            if (!layoutData.name || !layoutData.rows || !layoutData.columns || !layoutData.layout) {
                return res.status(400).send('Missing required fields for seat layout');
            }
            // The 'add' method automatically generates a new document ID
            const docRef = await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).add(layoutData);
            // Return the new layout's data, including the auto-generated ID
            res.status(201).json({ id: docRef.id, ...layoutData });
        } catch (error) {
            console.error(`Error creating seat layout: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Get all seat layouts
    router.get('/', async (req, res) => {
        try {
            await populateInitialData(SEAT_LAYOUTS_COLLECTION, sampleSeatLayouts, 'layoutId');
            const snapshot = await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).get();
            const layouts = [];
            snapshot.forEach(doc => {
                layouts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            res.json(layouts);
        } catch (error) {
            console.error(`Error fetching seat layouts: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Get a specific seat layout by ID
    router.get('/:id', async (req, res) => {
        try {
            const layoutId = req.params.id;
            const doc = await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).doc(layoutId).get();
            if (!doc.exists) {
                return res.status(404).send('Seat layout not found');
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            console.error(`Error fetching seat layout ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Update a seat layout by ID
    router.put('/:id', async (req, res) => {
        try {
            const layoutId = req.params.id;
            const layoutData = req.body;
            // Add validation for layoutData as needed
            await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).doc(layoutId).update(layoutData);
            const updatedDoc = await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).doc(layoutId).get();
            res.json({ id: updatedDoc.id, ...updatedDoc.data() });
        } catch (error) {
            console.error(`Error updating seat layout ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Delete a seat layout by ID
    router.delete('/:id', async (req, res) => {
        try {
            const layoutId = req.params.id;
            await admin.firestore().collection(SEAT_LAYOUTS_COLLECTION).doc(layoutId).delete();
            res.status(200).send(`Seat layout ${layoutId} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting seat layout ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    return router;
};
