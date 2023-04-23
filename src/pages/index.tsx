import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Spin } from "antd";
import Head from "next/head";

const Inicio = () => (
  <>
    <Head>
      <title>Sobrecupos</title>
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

export default WithAuth(Inicio);
