import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { Profile } from "@frontend-core/client/users/profile";

const ProfilePage = () => <Page title="Mis datos"><Profile /></Page>;

export default WithAuth(ProfilePage);