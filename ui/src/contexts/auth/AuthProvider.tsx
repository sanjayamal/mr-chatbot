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

  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await signIn({ username, password });
      checkAuthState();
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

  const checkAuthState = async () => {
    try {
      const user = await currentAuthenticatedUser();
      setIsAuthenticated(user !== null);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };
  const contextValue = useMemo(
    () => ({ login, logout, checkAuthState, isAuthenticated }),
    [login, logout, checkAuthState, isAuthenticated]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
