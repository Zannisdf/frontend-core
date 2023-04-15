import { Button, Form, Input } from "antd";

export const FinishSignUpForm = ({
  onFinish,
}: {
  onFinish: ({ email }: { email: string }) => any;
}) => (
  <Form
    name="finishSignUp"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600, padding: "0 24px" }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={() => {
      console.log("error");
    }}
    autoComplete="off"
  >
    <Form.Item
      label="Correo electrónico"
      name="email"
      rules={[{ required: true, message: "¡Ingresa tu correo electrónico!" }]}
    >
      <Input placeholder="jose@sobrecupos.com" />
    </Form.Item>

    <Form.Item>
      <Button block size="large" type="primary" htmlType="submit">
        Iniciar sesión
      </Button>
    </Form.Item>
  </Form>
);
