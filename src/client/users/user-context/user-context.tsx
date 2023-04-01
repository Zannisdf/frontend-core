import { PropsWithChildren, createContext, useContext, useState } from "react";
import { loginWithGoogle } from "./login-strategies/google";

export type User = Awaited<ReturnType<typeof loginWithGoogle>> | null;

export const UserContext = createContext<{
  user: User;
  login: (provider: string) => Promise<User | null>;
  logout: () => void;
}>({
  user: null,
  login: (_p) => Promise.resolve(null),
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = (provider: string) => {
    let authenticateUser = loginWithGoogle;

    setIsAuthenticating(true);

    if (provider === "GOOGLE") {
      authenticateUser = loginWithGoogle;
    }

    // if (provider === "EMAIL_LINK") {
    //   authenticateUser = loginWithEmailLink;
    // }

    return authenticateUser().then((currentUser) => {
      setUser(currentUser);
      setIsAuthenticating(false);
    });
  };

  const logout = () => {};

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
