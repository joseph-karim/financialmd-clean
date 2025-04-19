import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types
type User = {
  id: string;
  email: string;
};

type Session = {
  user: User | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication - simulate checking for an existing session
    const checkAuth = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll simulate a logged-in user
        const mockUser = { id: '1', email: 'user@example.com' };
        const mockSession = { user: mockUser };
        
        setSession(mockSession);
        setUser(mockUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock sign in
      const mockUser = { id: '1', email };
      const mockSession = { user: mockUser };
      
      setSession(mockSession);
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Mock sign out
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
