import { useRouter } from "next/router";
import { User, useUser } from "../users/user-context";
import { Spin } from "antd";
import { ComponentProps, JSXElementConstructor, useEffect } from "react";
import { availableRoutes, protectedRoutes } from "./routes";

const needsLogin = (user: User, currentPath: string) =>
  !user && protectedRoutes.some(({ path }) => path === currentPath);

export const WithAuth = <T extends JSXElementConstructor<any>>(
  Component: T
) => {
  const WithAuthView = (pageProps: ComponentProps<T>) => {
    const { user, isAuthenticating } = useUser();
    const { asPath, replace } = useRouter();
    const redirectToLoginPage = needsLogin(user, asPath);

    useEffect(() => {
      if (redirectToLoginPage) {
        replace(availableRoutes.login.path);
        return;
      }
    }, [redirectToLoginPage]);

    if (isAuthenticating || !user) {
      return (
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
      );
    }

    return <Component {...pageProps} />;
  };

  return WithAuthView;
};
