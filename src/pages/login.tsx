import { Page } from "@frontend-core/client/layout/page";
import { LoginForm } from "@frontend-core/client/users/login-form";
import { WithLoginRedirect } from "@frontend-core/client/users/with-login-redirect";

export const Login = () => (
  <Page title="Iniciar sesión">
    <LoginForm />
  </Page>
);

export default WithLoginRedirect(Login);
