import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "your_firebase_api_key_here";

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseConfigured]);

  const signInAsGuest = async () => {
    if (!isFirebaseConfigured) {
      // Mock user for demo mode
      const mockUser = { uid: 'guest-123', displayName: 'Guest Student' } as any;
      setUser(mockUser);
      setIsDemo(true);
      return;
    }
    try {
      const result = await signInAnonymously(auth);
      setUser(result.user);
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    await firebaseSignOut(auth);
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...userProfile, ...profile, uid: user.uid } as UserProfile;
    setUserProfile(newProfile);

    if (!isDemo && isFirebaseConfigured) {
      await setDoc(doc(db, 'users', user.uid), newProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isDemo, signInAsGuest, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
