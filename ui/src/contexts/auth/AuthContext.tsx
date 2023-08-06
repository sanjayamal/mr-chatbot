import { createContext } from "react";

interface AuthContextProps {
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  checkAuthState: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  login: async (): Promise<any> => {},
  logout: async (): Promise<any> => {},
  checkAuthState: () => {},
  isAuthenticated: false,
});

export default AuthContext;
