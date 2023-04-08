import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginWithGoogle } from "./login-strategies/google";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@frontend-core/server/firebase/auth";
import { Spin } from "antd";

export type User = Awaited<ReturnType<typeof loginWithGoogle>> | null;

export const UserContext = createContext<{
  user: User;
  login: (provider: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticating: boolean;
}>({
  user: null,
  login: (_p) => Promise.resolve(null),
  logout: () => {},
  isAuthenticating: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  const [user, setUser] = useState<{ user: User; isAuthenticating: boolean }>({
    user: null,
    isAuthenticating: true,
  });

  const login = (provider: string) => {
    let authenticateUser = loginWithGoogle;

    if (provider === "GOOGLE") {
      authenticateUser = loginWithGoogle;
    }

    // if (provider === "EMAIL_LINK") {
    //   authenticateUser = loginWithEmailLink;
    // }

    return authenticateUser().then((user) =>
      setUser({ user, isAuthenticating: false })
    );
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>
      setUser({ user, isAuthenticating: false })
    );
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user.user,
        login,
        logout,
        isAuthenticating: user.isAuthenticating,
      }}
    >
      {user.isAuthenticating ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
