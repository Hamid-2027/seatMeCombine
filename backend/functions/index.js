const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // Added to parse JSON request bodies

// Helper function to populate initial data if a collection is empty
const populateInitialData = async (collectionName, sampleDataArray, idField = 'id') => {
  const collectionRef = admin.firestore().collection(collectionName);
  const snapshot = await collectionRef.limit(1).get();
  console.log('[populateInitialData] Checking collection:', collectionName, '| snapshot.empty:', snapshot.empty, '| sampleDataArray.length:', sampleDataArray.length);
  if (snapshot.empty) {
    console.log(`[populateInitialData] Collection '${collectionName}' is empty. Populating with initial data...`);
    const batch = admin.firestore().batch();
    sampleDataArray.forEach(item => {
      const docId = item[idField];
      if (docId) {
        const docRef = collectionRef.doc(docId);
        batch.set(docRef, item);
      } else {
        const docRef = collectionRef.doc(); // Firestore auto-generates ID
        batch.set(docRef, item);
      }
    });
    await batch.commit();
    console.log(`[populateInitialData] Successfully populated '${collectionName}' with ${sampleDataArray.length} items.`);
  } else {
    console.log(`[populateInitialData] Collection '${collectionName}' already contains data. Skipping population.`);
  }
};

// Import route modules
const busCompanyRoutes = require('./routes/busCompanyRoutes');
const busRoutes = require('./routes/busRoutes');
const seatLayoutRoutes = require('./routes/seatLayoutRoutes');
const busScheduleRoutes = require('./routes/busScheduleRoutes');
const busesRoutes = require('./routes/buses');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Create a router for the API
const apiRouter = express.Router();

// Mount route modules on the apiRouter
apiRouter.use('/bus-companies', busCompanyRoutes(admin, populateInitialData));
apiRouter.use('/busRoutes', busRoutes(admin, populateInitialData));
apiRouter.use('/seatLayouts', seatLayoutRoutes(admin, populateInitialData));
apiRouter.use('/busSchedules', busScheduleRoutes(admin, populateInitialData));
apiRouter.use('/buses', busesRoutes(admin, populateInitialData));
apiRouter.use('/payment-methods', paymentMethodRoutes(admin, populateInitialData));
apiRouter.use('/user-profiles', userProfileRoutes(admin, populateInitialData));
apiRouter.use('/bookings', bookingRoutes(admin, populateInitialData));

// Mount the apiRouter under /seatme-backend/api
app.use('/seatme-backend/api', apiRouter);

const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const axios = require('axios');
const generateInvoicePDF = require('./generateInvoicePDF');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Initialize Stripe with your secret key
const stripe = new Stripe(functions.config().stripe.secret);

// /create-payment-intent
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

// /send-invoice
exports.sendInvoice = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { email, amount, paymentId } = req.body;
    try {
      // Generate PDF in temp directory
      const invoicePath = path.join(os.tmpdir(), `invoice_${paymentId}.pdf`);
      await generateInvoicePDF({ email, amount, paymentId, filePath: invoicePath });

      // Nodemailer config
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: functions.config().gmail.user,
          pass: functions.config().gmail.pass,
        },
      });

      let mailOptions = {
        from: functions.config().gmail.user,
        to: email,
        subject: 'Your Payment Invoice',
        text: 'Thank you for your payment. Please find your invoice attached.',
        attachments: [{ filename: 'invoice.pdf', path: invoicePath }],
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Invoice sent successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send invoice' });
    }
  });
});

// /process-payment
exports.processPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const payload = {
      // ...copy your payload fields here, using functions.config() for secrets...
      // Example:
      pp_MerchantID: functions.config().jazzcash.merchant_id,
      pp_Password: functions.config().jazzcash.password,
      // ...other fields from req.body...
    };
    try {
      const response = await axios.post('https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction', payload);
      res.json(response.data);
    } catch (error) {
      res.json({ error: error.message });
    }
  });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.region('asia-east1').https.onRequest(app);

// If running directly (not as a Firebase Function)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// firebase emulators:start --only functions
