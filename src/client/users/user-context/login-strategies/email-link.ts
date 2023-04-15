import { auth } from "@frontend-core/server/firebase/auth";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";

const actionCodeSettings = {
  url: `${process.env.NEXT_PUBLIC_SIGNUP_DOMAIN}/finalizar-registro`,
  handleCodeInApp: true,
};

const EMAIL_TOKEN = "emailForSignIn";

export const loginWithEmailLink = (email: string) =>
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem(EMAIL_TOKEN, email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

export const isValidSignInLink = () =>
  isSignInWithEmailLink(auth, window.location.href);

export const getStoredEmail = () => window.localStorage.getItem(EMAIL_TOKEN);

export const finishSignUpProcess = (email: string) =>
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      window.localStorage.removeItem(EMAIL_TOKEN);

      return result.user;
    })
    .catch((error) => {});
