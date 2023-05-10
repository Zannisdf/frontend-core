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
import { UserDoc, userService } from "../user.service";
import { useRouter } from "next/router";

export type User = UserDoc | null;

export const UserContext = createContext<{
  user: User;
  login: (provider: string) => void;
  logout: () => void;
  isAuthenticating: boolean;
}>({
  user: null,
  login: (_p) => {},
  logout: () => {},
  isAuthenticating: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  const { query } = useRouter();
  const [user, setUser] = useState<{
    user: User;
    isAuthenticating: boolean;
  }>({
    user: null,
    isAuthenticating: true,
  });

  const login = (provider: string) => {
    let authenticateUser = loginWithGoogle;

    if (provider === "GOOGLE") {
      authenticateUser = loginWithGoogle;
    }

    authenticateUser();
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userService.getOrCreateUser(user, query.email as string).then((userDoc) => {
          setUser({ user: userDoc, isAuthenticating: false });
        });
        return;
      }

      setUser({ user: null, isAuthenticating: false });
    });
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
