import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginWithFacebook: () => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call here
    // For now, we'll just simulate a successful login
    console.log(`Login attempt with username: ${username}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any non-empty username/password
    if (username && password) {
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    // In a real app, you would integrate with Facebook's SDK
    console.log('Facebook login');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // In a real app, you would integrate with Google's SDK
    console.log('Google login');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    return true;
  };

  const loginAsGuest = async (): Promise<boolean> => {
    // Guest login - no credentials needed
    console.log('Guest login');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    return true;
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loginWithFacebook,
    loginWithGoogle,
    loginAsGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};