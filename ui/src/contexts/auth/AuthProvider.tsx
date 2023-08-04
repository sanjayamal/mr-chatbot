import React, { useCallback, useMemo } from "react";
import AuthContext from "./AuthContext";
import { signIn, signOut } from "../../helpers/cognitoServices";
import {
  removeTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "../../helpers";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await signIn({ username, password });
      const { signInUserSession } = result;
      const { accessToken, refreshToken } = signInUserSession;
      setAccessTokenToLocalStorage(accessToken.jwtToken);
      setRefreshTokenToLocalStorage(refreshToken.token);
      return result;
    } catch (error) {
      return error;
    }
  }, []);

  const logout = useCallback(async () => {
    const result = signOut();
    removeTokenFormLocalStorage();
    return result;
  }, []);

  const contextValue = useMemo(() => ({ login, logout }), [login, logout]);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
