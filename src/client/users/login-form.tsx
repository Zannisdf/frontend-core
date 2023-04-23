import Head from "next/head";
import Script from "next/script";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { EmailAuthProvider, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Spin } from "antd";
import { availableRoutes } from "../authentication/routes";

declare global {
  interface Window {
    firebase: any;
    firebaseui: any;
  }
}

export const LoginForm = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    window.firebase = firebase;

    const ui = new window.firebaseui.auth.AuthUI(getAuth());
    const uiConfig = {
      signInSuccessUrl: availableRoutes.timeSlots.path,
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        },
        GoogleAuthProvider.PROVIDER_ID,
      ],
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  }, [isReady]);

  if (hasError) {
    return (
      <Alert
        style={{ margin: '0 24px' }}
        message="Algo salió mal"
        description="Intenta recargando la página"
        type="error"
        showIcon
      />
    );
  }

  return (
    <>
      <Script
        onLoad={() => setIsReady(true)}
        onError={() => setHasError(true)}
        src="https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth__es_419.js"
      />
      <Head>
        <link
          type="text/css"
          rel="stylesheet"
          href="https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.css"
        />
      </Head>

      {isReady ? null : (
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
      )}
      <div id="firebaseui-auth-container" />
    </>
  );
};
