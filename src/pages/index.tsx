import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Spin } from "antd";

const Inicio = () => <div
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

export default WithAuth(Inicio)
