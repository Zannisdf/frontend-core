import { GoogleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import { useUser } from "./user-context";

export const LoginForm = () => {
  const { login } = useUser();
  const onFinish = () => {
    login('EMAIL_LINK');
  };
  const onFinishFailed = () => {};

  return (
    <>
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, padding: "0 24px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: "¡Ingresa tu correo electrónico!" },
          ]}
        >
          <Input placeholder="jose@sobrecupos.com" />
        </Form.Item>

        <Form.Item>
          <Button block size="large" type="primary" htmlType="submit">
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "36px 0" }} />

      <div style={{ padding: "0 24px" }}>
        <Button
          block
          size="large"
          type="default"
          htmlType="button"
          onClick={() => login("GOOGLE")}
        >
          <GoogleOutlined /> Iniciar sesión con Google
        </Button>
      </div>
    </>
  );
};
