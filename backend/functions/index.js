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

// Mount route modules
app.use('/api/bus-companies', busCompanyRoutes(admin, populateInitialData));
app.use('/api/busRoutes', busRoutes(admin, populateInitialData));
app.use('/api/seatLayouts', seatLayoutRoutes(admin, populateInitialData));
app.use('/api/busSchedules', busScheduleRoutes(admin, populateInitialData));
app.use('/api/buses', busesRoutes(admin, populateInitialData));
app.use('/api/payment-methods', paymentMethodRoutes(admin, populateInitialData));
app.use('/api/user-profiles', userProfileRoutes(admin, populateInitialData));
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes(admin, populateInitialData));




// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);

// If running directly (not as a Firebase Function)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
