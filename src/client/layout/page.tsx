import { Layout, Menu, Spin, theme } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useUser } from "../users/user-context";
import { signedInNavbarRoutes } from "../authentication/routes";
import Image from "next/image";

export type PageProps = PropsWithChildren<{
  title?: string;
  seoTitle?: string;
  isLoading?: boolean;
}>;

const { Content, Header } = Layout;

export const Page = ({ children, title, seoTitle, isLoading }: PageProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { asPath } = useRouter();
  const { user, logout } = useUser();
  const navbarBaseRoutes = user?.isActivePractitioner
    ? signedInNavbarRoutes.map(({ path, label }) => ({
        key: path,
        label: <Link href={path}>{label}</Link>,
      }))
    : [];

  if (isLoading) {
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/sobrecupos-logo-isotype.png" />
          {seoTitle ? <title>{seoTitle}</title> : null}
        </Head>
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
      </>
    );
  }

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/sobrecupos-logo-isotype.png" />
        {seoTitle ? <title>{seoTitle}</title> : null}
      </Head>
      <Header style={{ paddingInline: "24px" }}>
        <div
          className="logo"
          style={{
            display: "inline-block",
            float: "left",
            marginRight: "16px",
          }}
        >
          <Image
            src="/sobrecupos-logo-isotype.png"
            width="32"
            height="32"
            alt="Logo Sobrecupos"
          />
        </div>
        {user ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[asPath]}
            items={[
              ...navbarBaseRoutes,
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
