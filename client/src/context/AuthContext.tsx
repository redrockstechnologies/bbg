import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if user is already authenticated (from session storage)
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('bbg_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean }> => {
    try {
      // If it's the hardcoded credentials (as requested in the requirements)
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        sessionStorage.setItem('bbg_auth', 'true');
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
          duration: 3000,
        });
        
        return { success: true };
      }
      
      // If not the hardcoded credentials, try Firebase collection
      const usersRef = collection(db, 'admins');
      const q = query(
        usersRef, 
        where('username', '==', username),
        where('password', '==', password)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setIsAuthenticated(true);
        sessionStorage.setItem('bbg_auth', 'true');
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
          duration: 3000,
        });
        
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bbg_auth');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
  };

  const value: AuthContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
