import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { getAccessTokenFormLocalStorage } from "../../helpers";

interface IProtected {
  children: React.ReactNode;
}
const Protected: React.FC<IProtected> = ({ children }) => {
  const accessToken = getAccessTokenFormLocalStorage();
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Protected;
