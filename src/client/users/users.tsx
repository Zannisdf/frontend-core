import { Table } from "antd";
import { UserDoc } from "./user.service";
import Link from "next/link";

const columns = [
  {
    title: "Correo electrónico",
    dataIndex: "email",
    key: "email",
    render: (text: string, record: UserDoc) => (
      <Link href={`/usuarios/${record.userId}`}>{text}</Link>
    ),
  },
  {
    title: "Nombres",
    dataIndex: "names",
    key: "names",
  },
  {
    title: "Apellidos",
    dataIndex: "surnames",
    key: "surnames",
  },
  {
    title: "Especialidad",
    dataIndex: "specialty",
    key: "specialty",
  }
];

export const Users = ({ users }: { users: UserDoc[] }) => (
  <Table
    dataSource={
      users.map((user) => ({
        userId: user.userId,
        key: user.userId,
        email: user.email,
        names: user.names,
        surnames: user.surnames,
        specialty: user.specialty,
      })) as any
    }
    columns={columns}
  />
);
