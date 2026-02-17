import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Plant {
    id?: string;
    name: string;
    groupId: string; // e.g., "buah", "bunga"
    categoryId: string; // e.g., "mangga", "anggur"
    variety: string; // e.g., "arumanis", "jupiter"
    ownerId: string;
    createdAt: Timestamp;
}

const COLLECTION_NAME = 'plants';

export const plantService = {
    // Add a new plant
    addPlant: async (plant: Omit<Plant, 'id' | 'createdAt'>) => {
        try {
            const cleanedPlant = {
                ...plant,
                name: (plant.name || '').trim(),
                categoryId: (plant.categoryId || '').trim(),
                variety: (plant.variety || '').trim(),
                groupId: (plant.groupId || '').trim(),
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...cleanedPlant,
                createdAt: Timestamp.now(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding plant:', error);
            throw error;
        }
    },

    // Get all plants for a specific user
    subscribeToPlants: (userId: string, callback: (plants: Plant[]) => void) => {
        const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', userId));
        return onSnapshot(q, (snapshot) => {
            const plants = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Plant[];
            callback(plants);
        });
    },

    // Update a plant
    updatePlant: async (id: string, plant: Partial<Plant>) => {
        try {
            const cleanedPlant: Partial<Plant> = { ...plant };
            if (plant.name !== undefined) cleanedPlant.name = plant.name.trim();
            if (plant.categoryId !== undefined) cleanedPlant.categoryId = plant.categoryId.trim();
            if (plant.variety !== undefined) cleanedPlant.variety = plant.variety.trim();
            if (plant.groupId !== undefined) cleanedPlant.groupId = plant.groupId.trim();

            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, cleanedPlant);
        } catch (error) {
            console.error('Error updating plant:', error);
            throw error;
        }
    },

    // Delete a plant
    deletePlant: async (id: string) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting plant:', error);
            throw error;
        }
    }
};
