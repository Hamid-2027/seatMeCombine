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
import { BusCompany } from '../../types/dataStructure';

const COLLECTION_NAME = 'busCompanies';

export const busCompanyService = {
  // Create a new bus company
  async createBusCompany(company: BusCompany): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, company.id);
    await setDoc(docRef, company);
  },

  // Get a bus company by ID
  async getBusCompanyById(id: string): Promise<BusCompany | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as BusCompany) : null;
  },

  // Get all bus companies
  async getAllBusCompanies(): Promise<BusCompany[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => doc.data() as BusCompany);
  },

  // Update a bus company
  async updateBusCompany(id: string, data: Partial<BusCompany>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Delete a bus company
  async deleteBusCompany(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Get bus companies by rating threshold
  async getBusCompaniesByRating(minRating: number): Promise<BusCompany[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('ratings.overall', '>=', minRating)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as BusCompany);
  }
}; 