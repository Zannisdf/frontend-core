import "antd/dist/reset.css";
import "@frontend-core/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@frontend-core/client/users/user-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
