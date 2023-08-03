import React, { useCallback, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { useReducer } from "react";
import { AuthAction } from "../../constants";
import { signIn, signOut } from "../../helpers/cognitoServices";

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
  refreshToken: string | null;
  idToken: string | null;
  user: {
    email: string;
    name: string;
    email_verified: boolean;
  };
}

function authReducer(
  state: IAuthState,
  { type, payload }: IAuthAction
): IAuthState {
  switch (type) {
    case "LOG_IN": {
      return {
        accessToken: payload?.accessToken,
        refreshToken: payload?.refreshToken,
        idToken: payload?.accessToken,
        user: payload?.user,
      };
    }
    case "LOG_OUT": {
      return {
        accessToken: null,
        refreshToken: null,
        idToken: null,
        user: {
          email: "",
          name: "",
          email_verified: false,
        },
      };
    }
    default:
      return {
        accessToken: null,
        refreshToken: null,
        idToken: null,
        user: {
          email: "",
          name: "",
          email_verified: false,
        },
      };
  }
}

const initialState: IAuthState = {
  accessToken: null,
  refreshToken: null,
  idToken: null,
  user: {
    email: "",
    name: "",
    email_verified: false,
  },
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (username: string, password: string) => {
    const result = await signIn({ username, password });

    const { attributes, signInUserSession } = result;
    const { email, name, email_verified } = attributes;
    const { accessToken, refreshToken, idToken } = signInUserSession;
    dispatch({
      type: AuthAction.LOG_IN,
      payload: {
        accessToken,
        refreshToken,
        idToken,
        user: { email, name, email_verified },
      },
    });
    return result;
  }, []);

  const logout = useCallback(async () => {
    const result = signOut();
    dispatch({ type: AuthAction.LOG_OUT });
    return result;
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
