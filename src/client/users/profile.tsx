import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tooltip } from "antd";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const Profile = () => {
  return (
    <Form
      name="basic"
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
        rules={[{ required: true, message: "¡Ingresa tu correo electrónico!" }]}
      >
        <Input placeholder="jose@sobrecupos.com" />
      </Form.Item>

      <Form.Item
        label="Número de registro"
        name="licenseId"
        rules={[{ required: true, message: "¡Ingresa tu número de registro!" }]}
      >
        <Input placeholder="12345" />
      </Form.Item>

      <Form.Item
        label="RUT"
        name="dni"
        rules={[{ required: true, message: "¡Ingresa tu rut!" }]}
      >
        <Input placeholder="10123456-0" />
      </Form.Item>

      <Form.Item
        label="Dirección de la consulta"
        name="practiceAddress"
        rules={[
          {
            required: true,
            message: "¡Ingresa la dirección de la consulta médica!",
          },
        ]}
      >
        <Input placeholder="Av. Siempreviva 123, Providencia" />
      </Form.Item>

      <Form.Item label="Sobre mí" name="about">
        <Input.TextArea placeholder="Médico con 10 años de experiencia en..." />
      </Form.Item>

      <Form.Item label="Teléfono" name="phone">
        <Input
          addonBefore="+"
          suffix={
            <Tooltip title="Usaremos este número en caso que el equipo de Sobrecupos necesite comunicarse contigo. Nunca lo compartiremos.">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
          type="tel"
          placeholder="56912345678"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item>
        <Button block size="large" type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};
