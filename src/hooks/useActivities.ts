import { useContext } from 'react';
import { ActivityContext } from '../contexts/ActivityContext';

export const useActivities = () => {
    const context = useContext(ActivityContext);
    if (context === undefined) {
        throw new Error('useActivities must be used within an ActivityProvider');
    }
    return context;
};
