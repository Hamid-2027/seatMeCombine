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
  Timestamp
} from 'firebase/firestore';
import { BusSchedule } from '../../types/dataStructure';

const COLLECTION_NAME = 'busSchedules';

export const busScheduleService = {
  // Create a new bus schedule
  async createBusSchedule(schedule: BusSchedule): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, schedule.id);
    await setDoc(docRef, {
      ...schedule,
      departureTime: Timestamp.fromDate(new Date(schedule.departureTime)),
      arrivalTime: Timestamp.fromDate(new Date(schedule.arrivalTime)),
      date: Timestamp.fromDate(new Date(schedule.date))
    });
  },

  // Get a bus schedule by ID
  async getBusScheduleById(id: string): Promise<BusSchedule | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      ...data,
      departureTime: data.departureTime.toDate().toISOString(),
      arrivalTime: data.arrivalTime.toDate().toISOString(),
      date: data.date.toDate().toISOString()
    } as BusSchedule;
  },

  // Get all bus schedules
  async getAllBusSchedules(): Promise<BusSchedule[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        departureTime: data.departureTime.toDate().toISOString(),
        arrivalTime: data.arrivalTime.toDate().toISOString(),
        date: data.date.toDate().toISOString()
      } as BusSchedule;
    });
  },

  // Get schedules by route and date
  async getSchedulesByRouteAndDate(routeId: string, date: string): Promise<BusSchedule[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, COLLECTION_NAME),
      where('routeId', '==', routeId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        departureTime: data.departureTime.toDate().toISOString(),
        arrivalTime: data.arrivalTime.toDate().toISOString(),
        date: data.date.toDate().toISOString()
      } as BusSchedule;
    });
  },

  // Update a bus schedule
  async updateBusSchedule(id: string, data: Partial<BusSchedule>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...data };
    
    if (data.departureTime) {
      updateData.departureTime = Timestamp.fromDate(new Date(data.departureTime));
    }
    if (data.arrivalTime) {
      updateData.arrivalTime = Timestamp.fromDate(new Date(data.arrivalTime));
    }
    if (data.date) {
      updateData.date = Timestamp.fromDate(new Date(data.date));
    }

    await updateDoc(docRef, updateData);
  },

  // Delete a bus schedule
  async deleteBusSchedule(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Get schedules by company
  async getSchedulesByCompany(companyId: string): Promise<BusSchedule[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('companyId', '==', companyId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        departureTime: data.departureTime.toDate().toISOString(),
        arrivalTime: data.arrivalTime.toDate().toISOString(),
        date: data.date.toDate().toISOString()
      } as BusSchedule;
    });
  }
}; 