import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { Users } from "@frontend-core/client/users/users";

export type UsersProps = {
  users: UserDoc[];
};

export const ManageUsers = ({ users }: UsersProps) => (
  <Page title="Administrar usuarios">
    <Users users={users} />
  </Page>
);

export const getServerSideProps = async () => {
  const users = await userService.listUsers();

  return {
    props: {
      users,
    },
  };
};

export default WithAuth(ManageUsers, { superUserOnly: true });
