import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";

const Inicio = () => <Page isLoading seoTitle="Sobrecupos" />;

export default WithAuth(Inicio);
