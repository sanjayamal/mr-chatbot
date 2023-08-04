import { createContext } from "react";

interface AuthContextProps {
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextProps>({
  login: async (): Promise<any> => {},
  logout: async (): Promise<any> => {},
});

export default AuthContext;
