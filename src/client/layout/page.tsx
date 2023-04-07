import { Layout, Menu, theme } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { useUser } from "../users/user-context";

export type PageProps = PropsWithChildren<{
  title?: string;
}>;

const { Content, Header } = Layout;

const availableRoutes = {
  profile: { path: "/perfil", label: "Perfil" },
  timeSlots: { path: "/sobrecupos", label: "Sobrecupos" },
  login: { path: "/login", label: "Iniciar Sesión" }
} as const;

const loggedInRoutes = [
  availableRoutes.profile,
  availableRoutes.timeSlots,
];

export const Page = ({ children, title }: PageProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { asPath, replace } = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user && asPath !== '/login') {
      replace(availableRoutes.login.path);
    }

    if (asPath === "/login" && user) {
      replace(availableRoutes.timeSlots.path);
    }
  }, [asPath]);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header>
        <div className="logo" />
        {user ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[asPath]}
            items={loggedInRoutes.map(({ path, label }) => ({
              key: path,
              label: <Link href={path}>{label}</Link>,
            }))}
          />
        ) : null}
      </Header>
      <Content style={{ padding: "0 24px" }}>
        {title ? <div style={{ padding: "16px 0" }}>{title}</div> : null}
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer, padding: "16px 0" }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};
