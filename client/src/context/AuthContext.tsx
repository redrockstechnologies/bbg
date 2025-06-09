import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save/update user data in Firestore
      const userDocRef = doc(db, 'users', user.email?.replace('@', '_').replace('.', '_') || user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
        company: 'Ballito Baby Gear', // Default company
        privileges: ['dashboard', 'inventory', 'testimonials', 'rates', 'contact-messages', 'settings'], // Default privileges
        lastSignIn: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true }); // merge: true ensures we don't overwrite existing data
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
        duration: 3000,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
