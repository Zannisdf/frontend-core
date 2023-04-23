import { Page } from "@frontend-core/client/layout/page";
import { UnsupportedBrowser } from "@frontend-core/client/layout/unsupported-browser";
import { LoginForm } from "@frontend-core/client/users/login-form";
import { WithLoginRedirect } from "@frontend-core/client/users/with-login-redirect";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

const supportedBrowsers = [
  "Firefox",
  "Mobile Firefox",
  "Chrome",
  "Mobile Chrome",
  "Safari",
  "Mobile Safari",
];

export const Login = () => {
  const [isSupportedUA, setIsSupportedUA] = useState<boolean | null>(null);

  useEffect(() => {
    const parser = new UAParser();
    const browser = parser.getBrowser();

    setIsSupportedUA(
      browser.name ? supportedBrowsers.includes(browser.name) : false
    );
  }, []);

  return (
    <Page
      title="Iniciar sesión"
      seoTitle="Iniciar sesión | Sobrecupos"
      isLoading={isSupportedUA === null}
    >
      {isSupportedUA ? <LoginForm /> : <UnsupportedBrowser />}
    </Page>
  );
};

export default WithLoginRedirect(Login);
