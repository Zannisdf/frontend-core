import { ComponentProps, JSXElementConstructor, useEffect } from "react";
import { useUser } from "./user-context";
import { useRouter } from "next/router";
import { availableRoutes } from "../authentication/routes";

export const WithLoginRedirect = <T extends JSXElementConstructor<any>>(
  Component: T
) => {
  const WithLoginRedirectComponent = (props: ComponentProps<T>) => {
    const { user } = useUser();
    const { replace } = useRouter();

    useEffect(() => {
      if (user) {
        replace(availableRoutes.timeSlots.path);
      }
    }, [user]);

    return <Component {...props} />;
  };

  return WithLoginRedirectComponent;
};
