import { createContext } from 'react';
import { type Plant } from '../services/plantService';

export interface PlantContextType {
    plants: Plant[];
    loading: boolean;
    addPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'ownerId'>) => Promise<string>;
    updatePlant: (id: string, plant: Partial<Plant>) => Promise<void>;
    deletePlant: (id: string) => Promise<void>;
}

export const PlantContext = createContext<PlantContextType | undefined>(undefined);
