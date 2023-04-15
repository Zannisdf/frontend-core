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
import { Spin, message } from "antd";
import { UserDoc, userService } from "../user.service";
import { loginWithEmailLink } from "./login-strategies/email-link";

export type User = UserDoc | null;

export const UserContext = createContext<{
  user: User;
  login: (provider: string, email?: string) => void;
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
  const [user, setUser] = useState<{
    user: User;
    isAuthenticating: boolean;
  }>({
    user: null,
    isAuthenticating: true,
  });

  const login = async (provider: string, email?: string) => {
    if (provider === "GOOGLE") {
      await loginWithGoogle();
      return;
    }

    if (provider === "EMAIL_LINK") {
      if (!email) {
        console.log("Email not provided for strategy EMAIL_LINK");
        return;
      }

      await loginWithEmailLink(email);
      message.info("¡Se envió un link de acceso a tu correo electrónico!");
      return;
    }

    console.log(`Strategy ${provider} is not supported`);
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userService.getOrCreateUser(user).then((userDoc) => {
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
