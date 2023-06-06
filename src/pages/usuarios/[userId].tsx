import { availableRoutes } from "@frontend-core/client/authentication/routes";
import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { Profile } from "@frontend-core/client/users/profile";
import { useUser } from "@frontend-core/client/users/user-context";
import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { GetServerSidePropsContext } from "next";

export const User = ({ user }: { user: UserDoc }) => (
  <Page title="Editar usuario">
    <Profile user={user} />
  </Page>
);

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const userId = context.params?.["userId"];

  if (!userId || typeof userId !== "string") {
    return {
      notFound: true,
    };
  }

  const user = await userService.getUser(userId);

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default WithAuth(User, { superUserOnly: true });
