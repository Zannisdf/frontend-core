import { useRouter } from "next/router";
import { User, useUser } from "../users/user-context";
import { ComponentProps, JSXElementConstructor, useEffect } from "react";
import { availableRoutes, protectedRoutes } from "./routes";

const needsLogin = (user: User, currentPath: string) =>
  !user && protectedRoutes.some(({ path }) => path === currentPath);

export const WithAuth = <T extends JSXElementConstructor<any>>(
  Component: T
) => {
  const WithAuthView = (pageProps: ComponentProps<T>) => {
    const { user } = useUser();
    const { asPath, replace } = useRouter();
    const redirectToLoginPage = needsLogin(user, asPath);

    useEffect(() => {
      if (redirectToLoginPage) {
        replace(availableRoutes.login.path);
        return;
      }
    }, [redirectToLoginPage]);

    return <Component {...pageProps} />;
  };

  return WithAuthView;
};
