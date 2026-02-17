import { createContext } from 'react';
import { type Activity } from '../services/activityService';

export interface ActivityContextType {
    activities: Activity[];
    loading: boolean;
    error: string | null;
    addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'userId'>) => Promise<string>;
    deleteActivity: (id: string) => Promise<void>;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);
