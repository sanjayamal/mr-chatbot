import { createContext } from "react";
import { IAuthState } from "./AuthProvider";

type AuthState = Pick<IAuthState, "accessToken" | "user">;

interface AuthContextProps extends AuthState {
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  user: {
    email: "",
    name: "",
    email_verified: false,
  },
  login: async (): Promise<any> => {},
  logout: async (): Promise<any> => {},
});

export default AuthContext;
