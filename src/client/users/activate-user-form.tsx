import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";

type ActivateUserFormProps = {
  onActivate: ({
    email,
    address1,
    address2,
    address3,
  }: {
    email: string;
    address1: string;
    address2?: string;
    address3?: string;
  }) => void;
  isLoading?: boolean;
};

export const ActivateUserForm = ({
  onActivate,
  isLoading,
}: ActivateUserFormProps) => {
  const { query } = useRouter();

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
        initialValue={query.email}
        rules={[
          {
            required: true,
            message: "¡Ingresa un correo electrónico!",
          },
        ]}
      >
        <Input placeholder="jose@sobrecupos.com" />
      </Form.Item>

      <Form.Item
        label="Dirección 1"
        name="address1"
        rules={[
          {
            required: true,
            message: "¡Ingresa una dirección",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Dirección 2" name="address2">
        <Input />
      </Form.Item>

      <Form.Item label="Dirección 3" name="address3">
        <Input />
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
