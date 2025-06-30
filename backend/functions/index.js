const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const path = require("path");

// Point directly to the .env file in the same directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

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

// Mount the apiRouter at the root
app.use('/api/', apiRouter);

const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const axios = require('axios');
const generateInvoicePDF = require('./generateInvoicePDF');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to format date/time for JazzCash
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Helper function to create the secure hash for JazzCash
const createSecureHash = (payload, hashKey) => {
  const sortedKeys = Object.keys(payload).sort();

  // 1. Create a string of non-empty values, sorted by key.
  const valuesString = sortedKeys
    .filter(key => !key.startsWith('ppmpf_')) // Exclude ppmpf fields from hash
    .map(key => payload[key])
    .filter(value => value !== '' && value !== null && value !== undefined)
    .join('&');

  // 2. Prepend the hashKey (Integrity Salt) and an ampersand to the string of values.
  const dataToHash = `${hashKey}&${valuesString}`;

  // 3. Calculate the HMAC-SHA256 of the resulting string using the hashKey as the secret.
  const hmac = crypto.createHmac('sha256', hashKey);
  hmac.update(dataToHash);
  return hmac.digest('hex');
};

// Create a new router for payment-related routes
const paymentRouter = express.Router();

// Define the /create-payment-intent route
paymentRouter.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // or amount from req.body
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({ error: error.message });
  }
});

// Define the /jazzcash-pay route
paymentRouter.post('/jazzcash-pay', async (req, res) => {
  try {
    console.log("\n--- New JazzCash Payment Request ---");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Request Body:", req.body);
    console.log("JAZZCASH_MERCHANT_ID loaded:", process.env.JAZZCASH_MERCHANT_ID ? 'Yes' : 'No - NOT FOUND');
    console.log("JAZZCASH_PASSWORD loaded:", process.env.JAZZCASH_PASSWORD ? 'Yes' : 'No - NOT FOUND');
    console.log("JAZZCASH_HASH_KEY loaded:", process.env.JAZZCASH_HASH_KEY ? 'Yes' : 'No - NOT FOUND');
    
    // Clean the environment variables from quotes
    const cleanMerchantId = process.env.JAZZCASH_MERCHANT_ID ? process.env.JAZZCASH_MERCHANT_ID.replace(/'/g, '') : '';
    const cleanPassword = process.env.JAZZCASH_PASSWORD ? process.env.JAZZCASH_PASSWORD.replace(/'/g, '') : '';
    const cleanHashKey = process.env.JAZZCASH_HASH_KEY ? process.env.JAZZCASH_HASH_KEY.replace(/'/g, '') : '';
    
    console.log("Cleaned Merchant ID:", cleanMerchantId);
    console.log("Cleaned Password length:", cleanPassword.length);
    console.log("Cleaned Hash Key length:", cleanHashKey.length);

    // --- Environment Variable Validation ---
    const { JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, JAZZCASH_HASH_KEY } = process.env;
    if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD || !JAZZCASH_HASH_KEY) {
      console.error('CRITICAL: JazzCash environment variables are missing. Please check the .env file.');
      return res.status(500).json({ message: 'Server configuration error. Contact support.' });
    }

    const { amount, mobileNumber, cnic } = req.body;

    if (!amount || !mobileNumber || !cnic) {
      return res.status(400).json({ message: 'Missing required fields: amount, mobileNumber, cnic' });
    }

    // Normalize mobile number to JazzCash required format (923xxxxxxxxx)
    const normalizeMobileNumber = (number) => {
      const cleaned = String(number).replace(/\D/g, '');
      if (cleaned.startsWith('03')) {
        return '92' + cleaned.substring(1);
      }
      if (cleaned.length === 10 && cleaned.startsWith('3')) {
        return '92' + cleaned;
      }
      return cleaned;
    };
    const normalizedMobileNumber = normalizeMobileNumber(mobileNumber);

    const now = new Date();
    const expiryTime = new Date(now.getTime() + 60 * 60000); // 1 hour expiry

    // For MWALLET transactions, use proper field values
    const payload = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: cleanMerchantId,
      pp_SubMerchantID: "",
      pp_Password: cleanPassword,
      pp_BankID: "TBANK",  // Sandbox bank identifier
      pp_ProductID: "RETL", // Retail product type required by JazzCash
      pp_TxnRefNo: "TXN" + Date.now(),
      pp_Amount: amount,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formatDateTime(now),
      pp_BillReference: "billRef",
      pp_Description: "Bus Booking Payment",
      pp_TxnExpiryDateTime: formatDateTime(expiryTime),
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment-status',
      pp_SecureHash: "", // Will be calculated next
      ppmpf_1: normalizedMobileNumber,
      ppmpf_2: cnic.replace(/\D/g, ''), // Last 6 digits of CNIC
      ppmpf_3: "",
      ppmpf_4: "",
      ppmpf_5: "",
    };

    // Create a temporary payload for hashing that doesn't include the hash itself.
    const payloadForHash = { ...payload };
    delete payloadForHash.pp_SecureHash; // This field must be excluded from the hash calculation.

    // Calculate the hash using the corrected payload and assign it.
    payload.pp_SecureHash = createSecureHash(payloadForHash, cleanHashKey);

    console.log("Sending payload to JazzCash:", payload);
    const jazzcashResponse = await axios.post(
      'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Received response from JazzCash:", jazzcashResponse.data);
    const responseData = jazzcashResponse.data;

    if (responseData && responseData.pp_ResponseCode === '000') {
      res.json({
        status: 'success',
        message: responseData.pp_ResponseMessage || 'Payment processed successfully!',
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: responseData.pp_ResponseMessage || 'Payment failed. Please try again.',
      });
    }

  } catch (error) {
    console.error("Error in /jazzcash-pay route:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      message: 'Failed to process payment.',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Mount the payment router on the apiRouter
apiRouter.use('/payment', paymentRouter);

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
