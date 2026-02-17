import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export type ActivityType =
  | 'pupuk'
  | 'fungisida'
  | 'insektisida'
  | 'monitor'
  | 'new_comer'
  | 'pangkas'
  | 'semai'
  | 'hama_penyakit'
  | 'panen_lainnya'
  | 'pisah_anakan';

export type WeatherCondition =
  | 'mendung'
  | 'cerah'
  | 'berawan'
  | 'hujan_deras'
  | 'hujan_gerimis';

export interface Activity {
  id?: string;
  plantId: string;
  targetScope: 'variety' | 'category' | 'group';
  targetValue: string;
  type: ActivityType;
  productName?: string;
  date: Timestamp;
  description: string;
  dosis?: string;
  volume?: string;
  method?: string;
  condition: WeatherCondition;
  photoUrl?: string; // Legacy support for single photo
  photoUrls?: string[]; // Support for multiple photos
  userId: string;
  createdAt: Timestamp;
}

const COLLECTION_NAME = 'activities';

// Helper for timeout
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

export const activityService = {
  addActivity: async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    console.log('Service: addActivity starting...', activity.type);
    try {
      const addPromise = addDoc(collection(db, COLLECTION_NAME), {
        ...activity,
        createdAt: Timestamp.now(),
      });

      // 15 second timeout for Firestore
      const docRef = await withTimeout(
        addPromise,
        15000,
        'Waktu habis saat menyimpan data. Periksa koneksi internet atau Firestore Rules Anda.'
      );

      console.log('Service: addActivity success:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Service: Error adding activity:', error);
      throw error;
    }
  },

  subscribeToPlantActivities: (
    plantId: string,
    callback: (activities: Activity[]) => void,
    onError?: (error: Error) => void
  ) => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('plantId', '==', plantId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];
        callback(activities);
      },
      (error) => {
        console.error('Error subscribing to plant activities:', error);
        if (onError) onError(error);
      }
    );
  },

  subscribeToUserActivities: (
    userId: string,
    callback: (activities: Activity[]) => void,
    onError?: (error: Error) => void
  ) => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];
        callback(activities);
      },
      (error) => {
        console.error('Error subscribing to user activities:', error);
        if (onError) onError(error);
      }
    );
  },

  deleteActivity: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  uploadImage: async (
    userId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    console.log('Service: uploadImage (Cloudinary) starting. File:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcporyxce';
    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'kebunku';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', `activities/${userId}`);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            if (onProgress) onProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            console.log(
              'Service: Cloudinary upload success. URL:',
              response.secure_url
            );
            resolve(response.secure_url);
          } else {
            const errorMsg =
              xhr.responseText || 'Gagal mengunggah foto ke Cloudinary';
            console.error('Service: Cloudinary status error:', errorMsg);
            reject(new Error(`Cloudinary Error: ${errorMsg}`));
          }
        };

        xhr.onerror = () => {
          console.error('Service: Cloudinary network error');
          reject(new Error('Masalah jaringan saat mengunggah ke Cloudinary.'));
        };

        const timeoutId = setTimeout(() => {
          xhr.abort();
          reject(new Error('Waktu habis saat mengunggah ke Cloudinary.'));
        }, 60000);

        xhr.onloadend = () => clearTimeout(timeoutId);

        xhr.send(formData);
      });
    } catch (immediateError) {
      console.error('Service: Cloudinary immediate error:', immediateError);
      throw immediateError;
    }
  },
};
