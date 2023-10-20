import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

interface IProtected {
  children: React.ReactNode;
}
const Protected: React.FC<IProtected> = ({ children }) => {
  const auth = useAuth();

  const { isAuthenticated, isCheckingAuthState } = auth;
  //TODO Please comment out when auth is enabled
  // if (!isAuthenticated && !isCheckingAuthState) {
  //   return <Navigate to="/login" replace />;
  // }
  return <>{children}</>;
};

export default Protected;
