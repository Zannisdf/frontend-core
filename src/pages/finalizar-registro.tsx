import { Page } from "@frontend-core/client/layout/page";
import { FinishSignUpForm } from "@frontend-core/client/users/finish-sign-up-form";
import {
  finishSignUpProcess,
  getStoredEmail,
  isValidSignInLink,
} from "@frontend-core/client/users/user-context/login-strategies/email-link";
import { WithLoginRedirect } from "@frontend-core/client/users/with-login-redirect";
import { Spin } from "antd";
import { useEffect, useState } from "react";

const FinalizarRegistro = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isValidSignInLink()) {
      const email = getStoredEmail();

      if (!email) {
        setIsLoading(false);
        return;
      }

      finishSignUpProcess(email);
    }
  }, []);

  const handleFinish = ({ email }: { email: string }) =>
    finishSignUpProcess(email);

  return (
    <Page title="Finalizar registro" seoTitle="Finalizar Registro | Sobrecupos">
      {isLoading ? (
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
        <FinishSignUpForm onFinish={handleFinish} />
      )}
    </Page>
  );
};

export default WithLoginRedirect(FinalizarRegistro);
