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
  where
} from 'firebase/firestore';

interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  estimatedDuration: string;
  availableBusTypes: string[];
  isPopular: boolean;
  companyIds: string[];
}

const COLLECTION_NAME = 'routes';

export const routeService = {
  // Create a new route
  async createRoute(route: Route): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, route.id);
    await setDoc(docRef, route);
  },

  // Get a route by ID
  async getRouteById(id: string): Promise<Route | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Route) : null;
  },

  // Get all routes
  async getAllRoutes(): Promise<Route[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => doc.data() as Route);
  },

  // Get popular routes
  async getPopularRoutes(): Promise<Route[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isPopular', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Route);
  },

  // Get routes by company
  async getRoutesByCompany(companyId: string): Promise<Route[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('companyIds', 'array-contains', companyId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Route);
  },

  // Update a route
  async updateRoute(id: string, data: Partial<Route>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Delete a route
  async deleteRoute(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Search routes by cities
  async searchRoutes(fromCity: string, toCity: string): Promise<Route[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('from', '==', fromCity),
      where('to', '==', toCity)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Route);
  },

  // Get routes by bus type
  async getRoutesByBusType(busType: string): Promise<Route[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('availableBusTypes', 'array-contains', busType)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Route);
  }
}; 