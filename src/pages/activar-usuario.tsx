import { availableRoutes } from "@frontend-core/client/authentication/routes";
import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { ActivateUserForm } from "@frontend-core/client/users/activate-user-form";
import { useUser } from "@frontend-core/client/users/user-context";
import { userService } from "@frontend-core/client/users/user.service";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActivarUsuario = () => {
  const { user } = useUser();
  const { replace } = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const activateUser = async ({
    email,
    address1,
    address2,
    address3,
  }: {
    email: string;
    address1: string;
    address2?: string;
    address3?: string;
  }) => {
    setIsValidating(true);

    await userService.activateUser({
      email,
      practiceAddresses: [address1, address2, address3].filter(a => !!a) as string[],
    }).catch((error) => {
      console.log(error);
      messageApi.open({
        type: "error",
        content: `Ocurrió un error activando el correo ${email}`,
      });
    });
    messageApi.open({
      type: "success",
      content: `Se activó el usuario ${email}`,
    });

    setIsValidating(false);
  };

  useEffect(() => {
    if (!user?.isSuperUser) {
      replace(availableRoutes.timeSlots.path);
      return;
    }

    setIsLoading(false);
    setIsValidating(false);
  }, []);

  return (
    <>
      {contextHolder}
      <Page
        title="Activar usuario"
        seoTitle="Activar usuario | Sobrecupos"
        isLoading={isLoading}
      >
        <ActivateUserForm isLoading={isValidating} onActivate={activateUser} />
      </Page>
    </>
  );
};

export default WithAuth(ActivarUsuario);
