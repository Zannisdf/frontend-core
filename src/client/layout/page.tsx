import { Layout, Menu, theme } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useUser } from "../users/user-context";
import { protectedRoutes } from "../authentication/routes";

export type PageProps = PropsWithChildren<{
  title?: string;
}>;

const { Content, Header } = Layout;

export const Page = ({ children, title }: PageProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { asPath } = useRouter();
  const { user, logout } = useUser();

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
            items={[
              ...protectedRoutes.map(({ path, label }) => ({
                key: path,
                label: <Link href={path}>{label}</Link>,
              })),
              {
                key: "/logout",
                label: (
                  <a role="button" onClick={logout}>
                    Salir
                  </a>
                ),
              },
            ]}
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
