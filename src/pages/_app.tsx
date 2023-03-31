import "antd/dist/reset.css";
import "@frontend-core/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

const { Header } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[router.asPath]}
          items={[
            { path: "/perfil", label: "Perfil" },
            { path: "/sobrecupos", label: "Sobrecupos" },
          ].map(({ path, label }) => ({
            key: path,
            label: <Link href={path}>{label}</Link>,
          }))}
        />
      </Header>
      <Component {...pageProps} />
    </Layout>
  );
}
