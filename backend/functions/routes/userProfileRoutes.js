const express = require('express');

const USER_PROFILES_COLLECTION = 'userProfiles';

// Define Gender enum locally
const Gender = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    PREFER_NOT_TO_SAY: 'prefer_not_to_say'
};

// Define BookingStatus enum locally
const BookingStatus = {
    PENDING: 'pending', // Booking initiated but not confirmed (e.g., awaiting payment)
    CONFIRMED: 'confirmed', // Payment successful, seat booked
    CANCELLED_BY_USER: 'cancelled_by_user',
    CANCELLED_BY_OPERATOR: 'cancelled_by_operator',
    COMPLETED: 'completed', // Journey finished
    MISSED: 'missed', // User did not show up
    RESCHEDULED: 'rescheduled'
};

// Sample Data for UserProfile
const sampleUserProfile = {
  id: 'user456',
  name: 'Muhammad Ali',
  email: 'muhammadali@example.com',
  phoneNumber: '+923001234567',
  gender: Gender.MALE, // Using the Gender object
  dateOfBirth: '1993-05-15',
  address: '123 Main Street, Gulberg',
  city: 'Lahore',
  country: 'Pakistan',
  profilePicture: 'assets/images/profiles/user456.jpg',
  savedPassengers: [
    {
      id: 'passenger1',
      name: 'Muhammad Ali',
      gender: Gender.MALE,
      seatNumber: '1A', // Example, might not be relevant for a saved passenger template
      bookedById: 'user456' // Should be the ID of the user who saved this passenger
    },
    {
      id: 'passenger2',
      name: 'Fatima Khan',
      gender: Gender.FEMALE,
      seatNumber: '1B', // Example
      bookedById: 'user456'
    }
  ],
  savedPaymentMethods: [
    {
      id: 'pm_user1', // Unique ID for this saved payment method instance
      type: 'credit_card', // Corresponds to an ID in PaymentMethods collection
      lastFourDigits: '4242',
      expiryDate: '05/28',
      cardHolderName: 'Muhammad Ali',
      isDefault: true
    },
    {
      id: 'pm_user2',
      type: 'easypaisa', // Corresponds to an ID in PaymentMethods collection
      isDefault: false
    }
  ],
  bookingHistory: [
    {
      id: 'booking123', // Booking ID
      from: 'Lahore',
      to: 'Islamabad',
      date: '2025-05-27',
      status: BookingStatus.CONFIRMED, // Using the BookingStatus object
      amount: 5000
    },
    {
      id: 'booking101',
      from: 'Lahore',
      to: 'Karachi',
      date: '2025-04-15',
      status: BookingStatus.COMPLETED,
      amount: 8500
    }
  ]
};


module.exports = function(admin, populateInitialData) {
    const router = express.Router();

    // --- UserProfile Endpoints ---

    // Create a new user profile
    router.post('/', async (req, res) => {
      try {
        const profileData = req.body;
        // Basic validation
        if (!profileData.name || !profileData.email) {
          return res.status(400).send('Missing required fields: name, email');
        }
        // The 'add' method automatically generates a new document ID
        const docRef = await admin.firestore().collection(USER_PROFILES_COLLECTION).add(profileData);
        // Return the new profile's data, including the auto-generated ID
        res.status(201).json({ id: docRef.id, ...profileData });
      } catch (error) {
        console.error(`Error creating user profile: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get all user profiles (and populate sample if empty or specific ID not found)
    router.get('/', async (req, res) => {
      try {
        const sampleDocRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(sampleUserProfile.id);
        const sampleDoc = await sampleDocRef.get();
        if (!sampleDoc.exists) {
          await sampleDocRef.set(sampleUserProfile);
        }

        const snapshot = await admin.firestore().collection(USER_PROFILES_COLLECTION).get();
        const profiles = [];
        snapshot.forEach(doc => {
          profiles.push({
            id: doc.id,
            ...doc.data()
          });
        });
        res.json(profiles);
      } catch (error) {
        console.error(`Error fetching user profiles: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Get a specific user profile by ID
    router.get('/:id', async (req, res) => {
      try {
        const profileId = req.params.id;
        const doc = await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(profileId).get();
        if (!doc.exists) {
          if (profileId === sampleUserProfile.id) {
            await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(sampleUserProfile.id).set(sampleUserProfile);
            const newDoc = await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(profileId).get();
            return res.json({ id: newDoc.id, ...newDoc.data() });
          }
          return res.status(404).send('User profile not found');
        }
        res.json({ id: doc.id, ...doc.data() });
      } catch (error) {
        console.error(`Error fetching user profile ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a user profile by ID
    router.put('/:id', async (req, res) => {
      try {
        const profileId = req.params.id;
        const profileData = req.body;
        if (!profileData.name && !profileData.email && !profileData.phoneNumber) {
            return res.status(400).send('No updateable fields provided.');
        }
        await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(profileId).update(profileData);
        const updatedDoc = await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(profileId).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
      } catch (error) {
        console.error(`Error updating user profile ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a user profile by ID
    router.delete('/:id', async (req, res) => {
      try {
        const profileId = req.params.id;
        await admin.firestore().collection(USER_PROFILES_COLLECTION).doc(profileId).delete();
        res.status(200).send(`User profile ${profileId} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting user profile ${req.params.id}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // --- Saved Passenger Endpoints (nested under UserProfile) ---

    // Add a new saved passenger to a user's profile
    router.post('/:userId/passengers', async (req, res) => {
      try {
        const userId = req.params.userId;
        const passengerData = req.body;

        if (!passengerData.id || !passengerData.name || !passengerData.gender) {
          return res.status(400).send('Missing required fields for passenger (id, name, gender).');
        }
        if (!Object.values(Gender).includes(passengerData.gender)) {
            return res.status(400).send('Invalid gender value.');
        }

        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        const userProfileData = userProfileDoc.data();
        const savedPassengers = userProfileData.savedPassengers || [];

        if (savedPassengers.some(p => p.id === passengerData.id)) {
          return res.status(409).send(`Passenger with id ${passengerData.id} already exists for this user.`);
        }

        const newPassenger = {
          id: passengerData.id,
          name: passengerData.name,
          gender: passengerData.gender,
          // seatNumber: passengerData.seatNumber, // Optional, might not be relevant for a template
          // bookedById: userId // Automatically set to the current user
        };

        await userProfileRef.update({
          savedPassengers: admin.firestore.FieldValue.arrayUnion(newPassenger)
        });

        res.status(201).json(newPassenger);
      } catch (error) {
        console.error(`Error adding saved passenger to user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a saved passenger in a user's profile
    router.put('/:userId/passengers/:passengerId', async (req, res) => {
      try {
        const { userId, passengerId } = req.params;
        const updatedPassengerData = req.body;

        if (!updatedPassengerData.name && !updatedPassengerData.gender) {
            return res.status(400).send('No updateable fields provided for passenger (name, gender).');
        }
        if (updatedPassengerData.gender && !Object.values(Gender).includes(updatedPassengerData.gender)) {
            return res.status(400).send('Invalid gender value.');
        }

        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        const userProfileData = userProfileDoc.data();
        let savedPassengers = userProfileData.savedPassengers || [];
        const passengerIndex = savedPassengers.findIndex(p => p.id === passengerId);

        if (passengerIndex === -1) {
          return res.status(404).send(`Saved passenger with id ${passengerId} not found for this user.`);
        }

        // Update the passenger details
        savedPassengers[passengerIndex] = { 
            ...savedPassengers[passengerIndex], 
            ...updatedPassengerData 
        };

        await userProfileRef.update({ savedPassengers });
        res.json(savedPassengers[passengerIndex]);
      } catch (error) {
        console.error(`Error updating saved passenger ${passengerId} for user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a saved passenger from a user's profile
    router.delete('/:userId/passengers/:passengerId', async (req, res) => {
      try {
        const { userId, passengerId } = req.params;
        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        const userProfileData = userProfileDoc.data();
        const savedPassengers = userProfileData.savedPassengers || [];
        const updatedPassengers = savedPassengers.filter(p => p.id !== passengerId);

        if (savedPassengers.length === updatedPassengers.length) {
          return res.status(404).send(`Saved passenger with id ${passengerId} not found for this user.`);
        }

        await userProfileRef.update({ savedPassengers: updatedPassengers });
        res.status(200).send(`Saved passenger ${passengerId} deleted successfully from user ${userId}'s profile.`);
      } catch (error) {
        console.error(`Error deleting saved passenger ${passengerId} for user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // --- Saved Payment Method Endpoints (nested under UserProfile) ---

    // Add a new saved payment method to a user's profile
    router.post('/:userId/payment-methods', async (req, res) => {
      try {
        const userId = req.params.userId;
        const pmData = req.body;

        if (!pmData.id || !pmData.type) {
          return res.status(400).send('Missing required fields for payment method (id, type).');
        }
        // Add more validation for pmData.type against existing PaymentMethods if needed

        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        const userProfileData = userProfileDoc.data();
        let savedPaymentMethods = userProfileData.savedPaymentMethods || [];

        if (savedPaymentMethods.some(pm => pm.id === pmData.id)) {
          return res.status(409).send(`Saved payment method with id ${pmData.id} already exists for this user.`);
        }
        
        // If setting a new default, ensure others are not default
        if (pmData.isDefault) {
            savedPaymentMethods = savedPaymentMethods.map(pm => ({...pm, isDefault: false}));
        }

        const newPaymentMethod = {
          id: pmData.id,
          type: pmData.type,
          lastFourDigits: pmData.lastFourDigits, // Optional
          expiryDate: pmData.expiryDate, // Optional
          cardHolderName: pmData.cardHolderName, // Optional
          isDefault: pmData.isDefault || false
        };
        
        savedPaymentMethods.push(newPaymentMethod);

        await userProfileRef.update({ savedPaymentMethods });
        res.status(201).json(newPaymentMethod);
      } catch (error) {
        console.error(`Error adding saved payment method to user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Update a saved payment method in a user's profile (e.g., set as default)
    router.put('/:userId/payment-methods/:pmId', async (req, res) => {
      try {
        const { userId, pmId } = req.params;
        const updatedPmData = req.body; // e.g., { isDefault: true }

        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        let userProfileData = userProfileDoc.data();
        let savedPaymentMethods = userProfileData.savedPaymentMethods || [];
        const pmIndex = savedPaymentMethods.findIndex(pm => pm.id === pmId);

        if (pmIndex === -1) {
          return res.status(404).send(`Saved payment method with id ${pmId} not found for this user.`);
        }

        // If setting as default, ensure others are not default
        if (updatedPmData.isDefault) {
            savedPaymentMethods = savedPaymentMethods.map(pm => ({...pm, isDefault: pm.id === pmId }));
        } else if (updatedPmData.hasOwnProperty('isDefault') && !updatedPmData.isDefault) {
            // If explicitly setting isDefault to false, just update that one
            savedPaymentMethods[pmIndex].isDefault = false;
            // Check if it was the only default, then no default is set.
            // Or, ensure at least one default if required by business logic (not handled here)
        }
        
        // Apply other updatable fields if any
        if (updatedPmData.lastFourDigits) savedPaymentMethods[pmIndex].lastFourDigits = updatedPmData.lastFourDigits;
        if (updatedPmData.expiryDate) savedPaymentMethods[pmIndex].expiryDate = updatedPmData.expiryDate;
        if (updatedPmData.cardHolderName) savedPaymentMethods[pmIndex].cardHolderName = updatedPmData.cardHolderName;

        await userProfileRef.update({ savedPaymentMethods });
        res.json(savedPaymentMethods[pmIndex]);
      } catch (error) {
        console.error(`Error updating saved payment method ${pmId} for user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    // Delete a saved payment method from a user's profile
    router.delete('/:userId/payment-methods/:pmId', async (req, res) => {
      try {
        const { userId, pmId } = req.params;
        const userProfileRef = admin.firestore().collection(USER_PROFILES_COLLECTION).doc(userId);
        const userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
          return res.status(404).send('UserProfile not found.');
        }

        const userProfileData = userProfileDoc.data();
        const savedPaymentMethods = userProfileData.savedPaymentMethods || [];
        const updatedPaymentMethods = savedPaymentMethods.filter(pm => pm.id !== pmId);

        if (savedPaymentMethods.length === updatedPaymentMethods.length) {
          return res.status(404).send(`Saved payment method with id ${pmId} not found for this user.`);
        }

        await userProfileRef.update({ savedPaymentMethods: updatedPaymentMethods });
        res.status(200).send(`Saved payment method ${pmId} deleted successfully from user ${userId}'s profile.`);
      } catch (error) {
        console.error(`Error deleting saved payment method ${pmId} for user ${userId}: ${error.message}`, error);
        res.status(500).send(error.message);
      }
    });

    return router;
};
