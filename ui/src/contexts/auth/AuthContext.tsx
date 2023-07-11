import { createContext } from "react";
import { IAuthState } from "./AuthProvider";

type AuthState = Pick<IAuthState, "accessToken" | "user">;

interface AuthContextProps extends AuthState {
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  user: { name: "Rajitha" },
  login: () => {},
  logout: () => {},
});

export default AuthContext;
