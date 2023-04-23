import { Button, Form, Input } from "antd";

type ActivateUserFormProps = {
  onActivate: ({ email }: { email: string }) => void;
  isLoading?: boolean;
};

export const ActivateUserForm = ({
  onActivate,
  isLoading,
}: ActivateUserFormProps) => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, padding: "0 24px" }}
      initialValues={{ remember: true }}
      onFinish={onActivate}
      onFinishFailed={() => undefined}
      autoComplete="off"
    >
      <Form.Item
        label="Correo del usuario a activar"
        name="email"
        rules={[
          {
            required: true,
            message: "¡Ingresa un correo electrónico!",
          },
        ]}
      >
        <Input placeholder="jose@sobrecupos.com" />
      </Form.Item>

      <Form.Item>
        <Button
          loading={isLoading}
          block
          size="large"
          type="primary"
          htmlType="submit"
        >
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};
