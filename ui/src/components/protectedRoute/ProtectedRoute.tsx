import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

interface IProtected {
  children: React.ReactNode;
}
const Protected: React.FC<IProtected> = ({ children }) => {
  const auth = useAuth();

  const { isAuthenticated } = auth;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Protected;
