import React, { useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { AuthContext } from './AuthContext';

// MOCK USER for automated testing
const MOCK_USER = {
    uid: 'mock-user-123',
    displayName: 'Mock Tester',
    email: 'mock@example.com',
    photoURL: 'https://via.placeholder.com/150',
} as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for mock parameter in URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('mock') === 'true') {
            console.log('Auth: Entering MOCK MODE');
            setUser(MOCK_USER);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        }, (error) => {
            console.error('Firebase Auth Error:', error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            if (user?.uid === 'mock-user-123') {
                setUser(null);
                return;
            }
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                color: 'var(--primary-700)',
                gap: '1rem'
            }}>
                <div className="animate-spin" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid var(--primary-200)',
                    borderTop: '4px solid var(--primary-600)',
                    borderRadius: '50%'
                }} />
                <div>Memuat KebunKU...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
