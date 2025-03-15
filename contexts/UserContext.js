import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { getCurrentUser, signOut, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const setError = useCallback((message) => {
    if (!message) return;

    if (typeof message === 'string' && message.includes("User needs to be authenticated")) {
      console.log("User not authenticated, proceeding as guest");
    } else {
      console.error(message);
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const attributes = await fetchUserAttributes();
      setUser(attributes);
    } catch (err) {
      console.error('Error fetching user attributes:', err);
      setError('Failed to fetch user data');
    }
  }, [isAuthenticated, setError]);

  const refreshSession = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const session = await fetchAuthSession();
      console.log('Session refreshed successfully');
      return session;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setError('Failed to refresh session. Some features may be unavailable.');
      return null;
    }
  }, [isAuthenticated, setError]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  }, [setError]);

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser().catch(() => null);
      if (currentUser) {
        setIsAuthenticated(true);
        const attributes = await fetchUserAttributes();
        setUser(attributes);
        await refreshSession();
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        await signOut();
        return false;
      }
    } catch (err) {
      console.log("No authenticated user found");
      setUser(null);
      setIsAuthenticated(false);
      await signOut();
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const updateUserProfile = async (imageUrl) => {
    try {
      setUser(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
    } catch (error) {
      throw error;
    }
  };

  const updateUsername = async (newUsername) => {
    try {
      setUser(prev => ({
        ...prev,
        Username: newUsername
      }));
    } catch (error) {
      throw error;
    }
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    errorMessage,
    isAuthenticated,
    logout,
    refreshUserData: fetchUserData,
    setError,
    refreshSession,
    checkSession,
    updateUserProfile,
    updateUsername,
  }), [user, loading, errorMessage, isAuthenticated, logout, fetchUserData, setError, refreshSession, checkSession, updateUserProfile, updateUsername]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};