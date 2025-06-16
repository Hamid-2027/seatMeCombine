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
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { Bus, Seat, SeatStatus } from '../../types/dataStructure';

const COLLECTION_NAME = 'buses';

export const busService = {
  // Create a new bus
  async createBus(bus: Bus): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, bus.id);
    await setDoc(docRef, bus);
  },

  // Get a bus by ID
  async getBusById(id: string): Promise<Bus | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Bus) : null;
  },

  // Get all buses
  async getAllBuses(): Promise<Bus[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => doc.data() as Bus);
  },

  // Get buses by company
  async getBusesByCompany(companyId: string): Promise<Bus[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('companyId', '==', companyId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Bus);
  },

  // Update a bus
  async updateBus(id: string, data: Partial<Bus>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Delete a bus
  async deleteBus(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Update seat status
  async updateSeatStatus(busId: string, seatId: string, status: SeatStatus): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, busId);
    const bus = await this.getBusById(busId);
    
    if (!bus) throw new Error('Bus not found');

    const updatedSeats = bus.seatLayout.seats.map(seat => 
      seat.id === seatId ? { ...seat, status } : seat
    );

    await updateDoc(docRef, {
      'seatLayout.seats': updatedSeats
    });
  },

  // Get available seats
  async getAvailableSeats(busId: string): Promise<Seat[]> {
    const bus = await this.getBusById(busId);
    if (!bus) throw new Error('Bus not found');

    return bus.seatLayout.seats.filter(seat => seat.status === SeatStatus.AVAILABLE);
  },

  // Block multiple seats
  async blockSeats(busId: string, seatIds: string[]): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, busId);
    const bus = await this.getBusById(busId);
    
    if (!bus) throw new Error('Bus not found');

    const updatedSeats = bus.seatLayout.seats.map(seat => 
      seatIds.includes(seat.id) ? { ...seat, status: SeatStatus.BLOCKED } : seat
    );

    await updateDoc(docRef, {
      'seatLayout.seats': updatedSeats
    });
  },

  // Get buses by type
  async getBusesByType(busType: string): Promise<Bus[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('busType', '==', busType)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Bus);
  }
}; 