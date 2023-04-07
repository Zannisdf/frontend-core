import { Page } from "@frontend-core/client/layout/page";
import { LoginForm } from "@frontend-core/client/users/login-form";

export default function Login() {
  return (
    <Page title="Iniciar sesión">
      <LoginForm />
    </Page>
  );
}
