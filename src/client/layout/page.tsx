import { Layout, theme } from "antd";
import type { PropsWithChildren } from "react";

export type PageProps = PropsWithChildren<{
  title?: string;
}>;

const { Content } = Layout;

export const Page = ({ children, title }: PageProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content style={{ padding: "0 24px" }}>
      {title ? <div style={{ padding: "16px 0" }}>{title}</div> : null}
      <div
        className="site-layout-content"
        style={{ background: colorBgContainer, padding: '16px 0' }}
      >
        {children}
      </div>
    </Content>
  );
};
