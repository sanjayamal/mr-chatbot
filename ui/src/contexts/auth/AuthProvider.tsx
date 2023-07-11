import React, { useCallback, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { useReducer } from "react";
import { AuthAction } from "../../constants";

interface AuthProviderProps {
  children: React.ReactNode;
}

// An interface for our actions
interface IAuthAction {
  type: AuthAction;
  payload?: any;
}

// An interface for our state
export interface IAuthState {
  accessToken: string | null;
  user: any;
}

function authReducer(
  state: IAuthState,
  { type, payload }: IAuthAction
): IAuthState {
  switch (type) {
    case "LOG_IN": {
      return {
        accessToken: payload?.accessToken,
        user: payload?.user,
      };
    }
    case "LOG_OUT": {
      return {
        accessToken: null,
        user: null,
      };
    }
    default:
      return {
        accessToken: null,
        user: null,
      };
  }
}

const initialState: IAuthState = {
  accessToken: null,
  user: { name: "Rajitha" },
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(() => {
    dispatch({
      type: AuthAction.LOG_IN,
      payload: { accessToken: "", user: "" },
    });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: AuthAction.LOG_OUT });
  }, []);

  const contextValue = useMemo(
    () => ({ login, logout, ...state }),
    [login, logout, state]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
