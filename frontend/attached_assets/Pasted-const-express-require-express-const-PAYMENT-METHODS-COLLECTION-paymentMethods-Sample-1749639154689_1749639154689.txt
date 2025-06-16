const express = require('express');

const PAYMENT_METHODS_COLLECTION = 'paymentMethods';

// Sample Data for Payment Methods
const samplePaymentMethods = [
  {
    id: 'pm_credit_card',
    type: 'credit_card',
    name: 'Credit Card',
    icon: 'assets/icons/credit_card.png',
    isPopular: true,
    processingFee: 1.5, // Percentage
    processingTime: 'Instant'
  },
  {
    id: 'pm_debit_card',
    type: 'debit_card',
    name: 'Debit Card',
    icon: 'assets/icons/debit_card.png',
    isPopular: true,
    processingFee: 1.0, // Percentage
    processingTime: 'Instant'
  },
  {
    id: 'pm_easypaisa',
    type: 'easypaisa',
    name: 'Easypaisa Mobile Account',
    icon: 'assets/icons/easypaisa.png',
    isPopular: true,
    processingFee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'pm_jazzcash',
    type: 'jazzcash',
    name: 'JazzCash Mobile Account',
    icon: 'assets/icons/jazzcash.png',
    isPopular: true,
    processingFee: 0,
    processingTime: 'Instant'
  },
  {
    id: 'pm_bank_transfer',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'assets/icons/bank_transfer.png',
    isPopular: false,
    processingFee: 0,
    processingTime: '1-2 business days'
  }
];

module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // Create a new payment method type
    router.post('/', async (req, res) => {
      try {
        const pmData = req.body;
        // Basic validation
        if (!pmData.type || !pmData.name) {
          return res.status(400).send('Missing required fields: type, name');
        }
        // The 'add' method automatically generates a new document ID
        const docRef = await admin.firestore().collection(PAYMENT_METHODS_COLLECTION).add(pmData);
        // Return the new payment method's data, including the auto-generated ID
        res.status(201).json({ id: docRef.id, ...pmData });
      } catch (error) {
        console.error(`Error creating payment method: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get all payment method types (and populate if empty)
    router.get('/', async (req, res) => {
      try {
        await populateInitialData(PAYMENT_METHODS_COLLECTION, samplePaymentMethods, 'id');
        const snapshot = await admin.firestore().collection(PAYMENT_METHODS_COLLECTION).get();
        const paymentMethods = [];
        snapshot.forEach(doc => {
          paymentMethods.push({
            id: doc.id,
            ...doc.data()
          });
        });
        res.json(paymentMethods);
      } catch (error) {
        console.error(`Error fetching payment methods: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get a specific payment method type by ID
    router.get('/:id', async (req, res) => {
      try {
        const pmId = req.params.id;
        const doc = await admin.firestore().collection(PAYMENT_METHODS_COLLECTION).doc(pmId).get();
        if (!doc.exists) {
          return res.status(404).send('Payment method not found');
        }
        res.json({ id: doc.id, ...doc.data() });
      } catch (error) {
        console.error(`Error fetching payment method ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a payment method type by ID
    router.put('/:id', async (req, res) => {
      try {
        const pmId = req.params.id;
        const pmData = req.body;
        if (!pmData.type || !pmData.name) { // ID is in URL, not body for update
          return res.status(400).send('Missing required fields: type, name');
        }
        await admin.firestore().collection(PAYMENT_METHODS_COLLECTION).doc(pmId).update(pmData);
        res.json({ id: pmId, ...pmData });
      } catch (error) {
        console.error(`Error updating payment method ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a payment method type by ID
    router.delete('/:id', async (req, res) => {
      try {
        const pmId = req.params.id;
        await admin.firestore().collection(PAYMENT_METHODS_COLLECTION).doc(pmId).delete();
        res.status(200).send(`Payment method ${pmId} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting payment method ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    return router;
};
