import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Tooltip, message } from "antd";
import { UserDoc, userService } from "./user.service";

export const Profile = ({ user }: { user: UserDoc }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: Partial<UserDoc>) => {
    const actualValues: Partial<UserDoc> = {};

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        // @ts-ignore
        actualValues[key] = value;
      }
    }

    actualValues.practiceAddresses =
      actualValues.practiceAddresses?.filter((address) => !!address) || [];

    actualValues.addressTags = ((values.addressTags || "") as string).split(
      ","
    );

    await userService.editUser(actualValues);

    messageApi.success("Usuario guardado exitosamente");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error(errorInfo);

    messageApi.error("No se pudo guardar el usuario");
  };

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ padding: "0 24px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item hidden name="userId" initialValue={user.userId}>
          <Input />
        </Form.Item>

        <Form.Item label="Código" name="code" initialValue={user.code}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="email"
          initialValue={user.email}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Foto de perfil"
          name="picture"
          initialValue={user.picture}
        >
          <Input placeholder="Ingresa una url" />
        </Form.Item>

        <Form.Item label="Nombres" name="names" initialValue={user.names}>
          <Input placeholder="José" />
        </Form.Item>

        <Form.Item
          label="Apellidos"
          name="surnames"
          initialValue={user.surnames}
        >
          <Input placeholder="Peña Morales" />
        </Form.Item>

        <Form.Item
          label="N° SIS"
          name="licenseId"
          initialValue={user.licenseId}
        >
          <Input placeholder="12345" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          initialValue={user.description}
        >
          <Input.TextArea placeholder="Médico con 10 años de experiencia en..." />
        </Form.Item>

        <Form.Item
          label="Especialidad"
          name="specialty"
          initialValue={user.specialty}
        >
          <Select
            options={[
              { value: "pediatria", label: "Pediatría" },
              { value: "otorrino", label: "Otorrino" },
              { value: "oftalmologia", label: "Oftalmología" },
              { value: "traumatologia", label: "Traumatología" },
              { value: "medicina-general", label: "Medicina general" },
              { value: "neurologia", label: "Neurología" },
              { value: "cirugia", label: "Cirugía" },
              {
                value: "inmunologia-y-alergias",
                label: "Inmunología y alergias",
              },
            ]}
          />
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

        <Form.Item
          label="Comunas de atención (separadas por coma y sin espacios)"
          name="addressTags"
          initialValue={user.addressTags}
        >
          <Input placeholder="Las Condes,Providencia" />
        </Form.Item>

        <Form.List
          name="practiceAddresses"
          initialValue={user.practiceAddresses}
        >
          {(fields, { add }) => (
            <div>
              {fields.map((field, index) => (
                <Form.Item {...field} key={`address-field-${index}`} label="Dirección de la consulta">
                  <Input placeholder="Av. Siempreviva 123, Providencia" />
                </Form.Item>
              ))}

              <Form.Item style={{ justifyContent: "flex-end" }}>
                <Button
                  block
                  size="middle"
                  type="dashed"
                  htmlType="button"
                  onClick={() => add()}
                >
                  Agregar otra dirección
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        <Form.Item>
          <Button block size="large" type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
