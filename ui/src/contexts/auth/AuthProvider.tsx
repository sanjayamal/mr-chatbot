import React, { useCallback, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import {
  currentAuthenticatedUser,
  signIn,
  signOut,
} from "../../helpers/cognitoServices";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuthState, setIsCheckingAuthState] = useState<boolean>(true);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await signIn({ username, password });
      if (result?.username) {
        setIsAuthenticated(true);
      }
      return result;
    } catch (error) {
      return error;
    }
  }, []);

  const logout = useCallback(async () => {
    const result = signOut();
    setIsAuthenticated(false);
    return result;
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      setIsCheckingAuthState(true);
      const user = await currentAuthenticatedUser();
      setIsAuthenticated(user !== null);
      setIsCheckingAuthState(false);
    } catch (err) {
      setIsAuthenticated(false);
      setIsCheckingAuthState(false);
    }
  }, []);
  
  const contextValue = useMemo(
    () => ({
      login,
      logout,
      checkAuthState,
      isAuthenticated,
      isCheckingAuthState,
    }),
    [login, logout, checkAuthState, isAuthenticated, isCheckingAuthState]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
