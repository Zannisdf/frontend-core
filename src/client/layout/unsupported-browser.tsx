import { Alert } from "antd";

export const UnsupportedBrowser = () => (
  <Alert
    style={{ margin: '0 24px' }}
    message="Navegador no soportado"
    description="Abre esta ventana directamente en un navegador como Chrome, Firefox o Safari para continuar"
    type="warning"
    showIcon
  />
)