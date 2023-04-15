import { Space, Typography } from "antd";
import { useUser } from "./user-context";
import { CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons";

const { Text } = Typography;

export const VerificationStatus = () => {
  const { user } = useUser();

  return (
    <div style={{ padding: "0 24px" }}>
      <Space size="large">
        <Text>
          {user?.isActivePractitioner ? (
            <CheckCircleTwoTone style={{ fontSize: "32px" }} />
          ) : (
            <ClockCircleTwoTone style={{ fontSize: "32px" }} />
          )}
        </Text>
        <Text>
          {user?.isActivePractitioner
            ? "Tu cuenta ha sido verificada exitosamente 🚀"
            : "Si recibiste una invitación, activaremos tu cuenta en un plazo máximo de 24 horas."}
        </Text>
      </Space>
    </div>
  );
};
