const express = require('express');

const SEAT_LAYOUTS_COLLECTION = 'seatLayouts';

// Sample Data for SeatLayouts (extracted from dataStcuture.ts)
const sampleSeatLayouts =[
    {
        "id": "HzA9jThvh49PNFw9ndmJ",
        "name": "2x2 Business Class",
        "rows": 10,
        "columns": 4,
        "layout": {
            "row0": [
                "1A",
                "A",
                "A",
                "1B"
            ],
            "row1": [
                "2A",
                "A",
                "A",
                "2B"
            ],
            "row2": [
                "3A",
                "A",
                "A",
                "3B"
            ],
            "row3": [
                "4A",
                "A",
                "A",
                "4B"
            ],
            "row4": [
                "5A",
                "A",
                "A",
                "5B"
            ],
            "row5": [
                "6A",
                "A",
                "A",
                "6B"
            ],
            "row6": [
                "7A",
                "A",
                "A",
                "7B"
            ],
            "row7": [
                "8A",
                "A",
                "A",
                "8B"
            ],
            "row8": [
                "9A",
                "A",
                "A",
                "9B"
            ],
            "row9": [
                "10A",
                "10B",
                "10C",
                "10D"
            ]
        },
        "seats": [
            {
                "seatNumber": "1A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "1B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "2A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "2B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "3A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "3B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "4A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "4B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "5A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "5B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "6A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "6B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "7A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "7B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "8A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "8B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "9A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "9B",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "10A",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "10B",
                "status": "AVAILABLE",
                "type": "AISLE",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "10C",
                "status": "AVAILABLE",
                "type": "AISLE",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "10D",
                "status": "AVAILABLE",
                "type": "WINDOW",
                "isPremiumSeat": true
            }
        ]
    },
    {
        "name": "1x2 Sleeper",
        "rows": 8,
        "columns": 3,
        "layout": {
            "row0": [
                "1A",
                "A",
                "1B"
            ],
            "row1": [
                "2A",
                "A",
                "2B"
            ],
            "row2": [
                "3A",
                "A",
                "3B"
            ],
            "row3": [
                "4A",
                "A",
                "4B"
            ],
            "row4": [
                "5A",
                "A",
                "5B"
            ],
            "row5": [
                "6A",
                "A",
                "6B"
            ],
            "row6": [
                "7A",
                "A",
                "7B"
            ],
            "row7": [
                "8A",
                "A",
                "8B"
            ]
        },
        "seats": [
            {
                "seatNumber": "1A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "1B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "2A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "2B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "3A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "3B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "4A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "4B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "5A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "5B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "6A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "6B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "7A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "7B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": true
            },
            {
                "seatNumber": "8A",
                "status": "AVAILABLE",
                "type": "LOWER_BERTH",
                "isPremiumSeat": false
            },
            {
                "seatNumber": "8B",
                "status": "AVAILABLE",
                "type": "UPPER_BERTH",
                "isPremiumSeat": false
            }
        ]
    }
]
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
