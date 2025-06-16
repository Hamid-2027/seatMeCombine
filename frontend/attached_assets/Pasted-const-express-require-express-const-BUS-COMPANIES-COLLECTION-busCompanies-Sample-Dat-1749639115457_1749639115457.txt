const express = require('express');

const BUS_COMPANIES_COLLECTION = 'busCompanies';

// Sample Data for Bus Companies (moved from index.js)
const sampleBusCompanies = [
  {
    id: 'daewoo_express',
    name: 'Daewoo Express',
    logo: 'https://www.daewoo.com.pk/images/logo.png',
    description: 'Daewoo Express is one of the leading bus operators in Pakistan, known for its luxury and comfortable services.',
    foundedYear: 1997,
    headquarters: 'Lahore, Pakistan',
    contactInfo: {
      email: 'info@daewoo.com.pk',
      phone: '111-007-008',
      website: 'https://www.daewoo.com.pk',
    },
    services: ['Intercity Bus Service', 'Cargo Service', 'City Bus Service'],
    fleetSize: 350,
    routesCovered: ['Lahore to Islamabad', 'Karachi to Hyderabad', 'Multan to Faisalabad'],
    ratings: {
      overall: 4.5,
      comfort: 4.6,
      punctuality: 4.4,
      cleanliness: 4.7,
      staffBehavior: 4.5,
      reviewCount: 12000
    },
    certifications: ['ISO 9001:2015'],
    busTypes: ['Luxury', 'Executive', 'Standard']
  },
  {
    id: 'faisal_movers',
    name: 'Faisal Movers',
    logo: 'https://www.faisalmovers.com/images/logo.png',
    description: 'Faisal Movers offers a wide range of bus services across Pakistan with a focus on affordability and reliability.',
    foundedYear: 2003,
    headquarters: 'Sargodha, Pakistan',
    contactInfo: {
      email: 'support@faisalmovers.com',
      phone: '111-22-44-88',
      website: 'https://www.faisalmovers.com',
    },
    services: ['Intercity Bus Service', 'Cargo Delivery', 'Tour Services'],
    fleetSize: 400,
    routesCovered: ['Major cities across Pakistan'],
    ratings: {
      overall: 4.3,
      comfort: 4.2,
      punctuality: 4.3,
      cleanliness: 4.4,
      staffBehavior: 4.3,
      reviewCount: 9500
    },
    certifications: [],
    busTypes: ['Business Class', 'Executive Plus', 'Standard']
  }
  // Add more sample bus companies if needed
];

module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // Create a new bus company
    router.post('/', async (req, res) => {
        try {
            const companyData = req.body;
            // Basic validation
            if (!companyData.name) {
                return res.status(400).send('Missing required field: name');
            }
            // The 'add' method automatically generates a new document ID
            const docRef = await admin.firestore().collection(BUS_COMPANIES_COLLECTION).add(companyData);
            // Return the new company's data, including the auto-generated ID
            res.status(201).json({ id: docRef.id, ...companyData });
        } catch (error) {
            console.error(`Error creating bus company: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Get all bus companies (and populate if empty)
    router.get('/', async (req, res) => {
        try {
            await populateInitialData(BUS_COMPANIES_COLLECTION, sampleBusCompanies, 'id');
            const snapshot = await admin.firestore().collection(BUS_COMPANIES_COLLECTION).get();
            const companies = [];
            snapshot.forEach(doc => {
                companies.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            res.json(companies);
        } catch (error) {
            console.error(`Error fetching bus companies: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Get a specific bus company by ID
    router.get('/:id', async (req, res) => {
        try {
            const companyId = req.params.id;
            const doc = await admin.firestore().collection(BUS_COMPANIES_COLLECTION).doc(companyId).get();
            if (!doc.exists) {
                return res.status(404).send('Bus company not found');
            }
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            console.error(`Error fetching bus company ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Update a bus company by ID
    router.put('/:id', async (req, res) => {
        try {
            const companyId = req.params.id;
            const companyData = req.body;
            await admin.firestore().collection(BUS_COMPANIES_COLLECTION).doc(companyId).update(companyData);
            const updatedDoc = await admin.firestore().collection(BUS_COMPANIES_COLLECTION).doc(companyId).get();
            res.json({ id: updatedDoc.id, ...updatedDoc.data() });
        } catch (error) {
            console.error(`Error updating bus company ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    // Delete a bus company by ID
    router.delete('/:id', async (req, res) => {
        try {
            const companyId = req.params.id;
            await admin.firestore().collection(BUS_COMPANIES_COLLECTION).doc(companyId).delete();
            res.status(200).send(`Bus company ${companyId} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting bus company ${req.params.id}: ${error.message}`, error);
            res.status(500).send(error.message);
        }
    });

    return router;
};
