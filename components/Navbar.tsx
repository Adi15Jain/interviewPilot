import { getCurrentUser } from "@/lib/actions/auth.action";
import NavbarClient from "./NavbarClient";
import UserProfileButton from "./UserProfileButton";

const Navbar = async () => {
    const user = await getCurrentUser();

    return <NavbarClient user={user} UserProfileButton={UserProfileButton} />;
};

export default Navbar;
