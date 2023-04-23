import { InfoCircleOutlined } from "@ant-design/icons";
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
  const { replace, query } = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const activateUser = async ({ email }: { email: string }) => {
    setIsValidating(true);

    await userService.activateUser(email);

    setIsValidating(false);
  };

  useEffect(() => {
    if (!user?.isSuperUser) {
      replace(availableRoutes.timeSlots.path);
      return;
    }

    if (query.email && typeof query.email === "string") {
      userService
        .activateUser(query.email)
        .then(() => {
          setIsLoading(false);
          setIsValidating(false);
          messageApi.open({
            type: "success",
            content: `Se activó el usuario ${query.email}`,
          });
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: `Ocurrió un error activando el correo ${query.email}`,
          });
        });
    }
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
