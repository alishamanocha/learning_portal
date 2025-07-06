"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { User } from "@/app/types/firestore";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userProfile: null, 
  loading: true,
  updateUserProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = doc(db, "users", firebaseUser.uid);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        setUserProfile(userSnapshot.data() as User);
      } else {
        // Create default user profile
        const defaultProfile: User = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || ''
        };
        
        await setDoc(userDoc, defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Set a fallback profile
      setUserProfile({
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || ''
      });
    }
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user) return;
    
    try {
      const userDoc = doc(db, "users", user.uid);
      const updatedProfile = { ...userProfile, ...profile };
      await setDoc(userDoc, updatedProfile, { merge: true });
      setUserProfile(updatedProfile as User);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);