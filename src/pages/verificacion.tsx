import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { VerificationStatus } from "@frontend-core/client/users/verification-status";

const Verificacion = () => (
  <Page title="Verificación de cuenta">
    <VerificationStatus />
  </Page>
);

export default WithAuth(Verificacion);
