import { useRouter } from "next/router";
import { User, useUser } from "../users/user-context";
import { ComponentProps, JSXElementConstructor, useEffect } from "react";
import { availableRoutes, protectedRoutes } from "./routes";

type Options = {
  superUserOnly?: boolean;
}

const needsLogin = (user: User, currentPath: string) =>
  !user && protectedRoutes.some(({ path }) => path === currentPath);

export const WithAuth = <T extends JSXElementConstructor<any>>(
  Component: T,
  options: Options = {}
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

      if (!user?.isActivePractitioner) {
        replace(availableRoutes.waitingActivation.path);
      }
    }, [redirectToLoginPage]);

    useEffect(() => {
      if (!options.superUserOnly) return;

      if (!user?.isSuperUser) {
        replace(availableRoutes.timeSlots.path);
        return;
      }
    }, []);

    return <Component {...pageProps} />;
  };

  return WithAuthView;
};
