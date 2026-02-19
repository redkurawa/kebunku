import React, { useEffect, useState } from 'react';
import { type Activity, activityService } from '../services/activityService';
import { useAuth } from '../hooks/useAuth';
import { ActivityContext } from './ActivityContext';

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    if (!user) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setActivities([]);
          setLoading(false);
          setError(null);
        }
      });
    } else {
      setLoading(true);
      setError(null);
      console.log('Provider: Subscribing to activities for', user.uid);
      unsubscribe = activityService.subscribeToUserActivities(
        user.uid,
        (data) => {
          if (isMounted) {
            console.log(`Provider: Received ${data.length} activities`);
            try {
              // Sort manually since we are removing orderBy from query to avoid index issues
              // Using very defensive sorting for old or malformed data
              const sortedData = [...data].sort((a, b) => {
                const getMillis = (dateObj: any) => {
                  if (dateObj && typeof dateObj.toMillis === 'function')
                    return dateObj.toMillis();
                  if (dateObj instanceof Date) return dateObj.getTime();
                  if (typeof dateObj === 'string')
                    return new Date(dateObj).getTime();
                  return 0;
                };
                return getMillis(b.date) - getMillis(a.date);
              });
              setActivities(sortedData);
              setLoading(false);
            } catch (sortError) {
              console.error('Provider: Error sorting activities:', sortError);
              setActivities(data); // Fallback to unsorted if sort fails
              setLoading(false);
            }
          }
        },
        (err) => {
          console.error('Provider: Subscription error:', err);
          if (isMounted) {
            setError(
              err.message ||
                'Gagal mengambil data riwayat (Kemungkinan masalah Index Firestore).'
            );
            setLoading(false);
          }
        }
      );
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const addActivity = async (
    activity: Omit<Activity, 'id' | 'createdAt' | 'userId'>
  ) => {
    if (!user) {
      console.error('Provider: addActivity failed - no user');
      throw new Error('User not authenticated');
    }
    console.log('Provider: Calling activityService.addActivity');
    const result = await activityService.addActivity({
      ...activity,
      userId: user.uid,
    });
    console.log('Provider: activityService.addActivity success, ID:', result);
    return result;
  };

  const deleteActivity = async (id: string) => {
    await activityService.deleteActivity(id);
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    await activityService.updateActivity(id, activity);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        error,
        addActivity,
        deleteActivity,
        updateActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
