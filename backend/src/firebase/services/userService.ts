import { db } from '../config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { UserProfile, BookingStatus, Gender } from '../../types/dataStructure';

const COLLECTION_NAME = 'users';

export const userService = {
  // Create a new user profile
  async createUserProfile(user: UserProfile): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, user.id);
    await setDoc(docRef, user);
  },

  // Get a user profile by ID
  async getUserProfileById(id: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  // Update a user profile
  async updateUserProfile(id: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Delete a user profile
  async deleteUserProfile(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Add a booking to user's history
  async addBookingToHistory(userId: string, booking: {
    id: string;
    from: string;
    to: string;
    date: string;
    status: BookingStatus;
    amount: number;
  }): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      bookingHistory: arrayUnion(booking)
    });
  },

  // Update booking status in user's history
  async updateBookingStatus(userId: string, bookingId: string, status: BookingStatus): Promise<void> {
    const user = await this.getUserProfileById(userId);
    if (!user) throw new Error('User not found');

    const updatedHistory = user.bookingHistory.map(booking =>
      booking.id === bookingId ? { ...booking, status } : booking
    );

    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      bookingHistory: updatedHistory
    });
  },

  // Add a saved passenger
  async addSavedPassenger(userId: string, passenger: {
    id: string;
    name: string;
    gender: Gender;
    seatNumber: string;
    bookedById: string;
  }): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      savedPassengers: arrayUnion(passenger)
    });
  },

  // Remove a saved passenger
  async removeSavedPassenger(userId: string, passengerId: string): Promise<void> {
    const user = await this.getUserProfileById(userId);
    if (!user) throw new Error('User not found');

    const passenger = user.savedPassengers.find(p => p.id === passengerId);
    if (!passenger) throw new Error('Passenger not found');

    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      savedPassengers: arrayRemove(passenger)
    });
  },

  // Add a saved payment method
  async addSavedPaymentMethod(userId: string, paymentMethod: {
    id: string;
    type: string;
    lastFourDigits?: string;
    expiryDate?: string;
    cardHolderName?: string;
    isDefault: boolean;
  }): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      savedPaymentMethods: arrayUnion(paymentMethod)
    });
  },

  // Remove a saved payment method
  async removeSavedPaymentMethod(userId: string, methodId: string): Promise<void> {
    const user = await this.getUserProfileById(userId);
    if (!user) throw new Error('User not found');

    const method = user.savedPaymentMethods.find(m => m.id === methodId);
    if (!method) throw new Error('Payment method not found');

    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      savedPaymentMethods: arrayRemove(method)
    });
  }
}; 