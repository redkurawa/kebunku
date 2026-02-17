import React, { useEffect, useState } from 'react';
import { type Plant, plantService } from '../services/plantService';
import { useAuth } from '../hooks/useAuth';
import { PlantContext } from './PlantContext';

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        let isMounted = true;
        let unsubscribe: (() => void) | undefined;

        if (!user) {
            // Defer to next tick to avoid synchronous setState warning
            Promise.resolve().then(() => {
                if (isMounted) {
                    setPlants([]);
                    setLoading(false);
                }
            });
        } else {
            unsubscribe = plantService.subscribeToPlants(user.uid, (data) => {
                if (isMounted) {
                    setPlants(data);
                    setLoading(false);
                }
            });
        }

        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const addPlant = async (plant: Omit<Plant, 'id' | 'createdAt' | 'ownerId'>) => {
        if (!user) throw new Error('User not authenticated');
        return await plantService.addPlant({ ...plant, ownerId: user.uid });
    };

    const updatePlant = async (id: string, plant: Partial<Plant>) => {
        await plantService.updatePlant(id, plant);
    };

    const deletePlant = async (id: string) => {
        await plantService.deletePlant(id);
    };

    return (
        <PlantContext.Provider value={{ plants, loading, addPlant, updatePlant, deletePlant }}>
            {children}
        </PlantContext.Provider>
    );
};
