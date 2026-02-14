import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import UserProfileButton from "./UserProfileButton";

const Navbar = async () => {
    const user = await getCurrentUser();

    return (
        <nav className="flex items-center justify-between w-full py-4">
            <Link
                href="/"
                className="flex items-center gap-2 group transition-all"
            >
                <Image
                    src="/logo.svg"
                    alt="InterviewPilot Logo"
                    width={38}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                />
                <h2 className="text-primary-100 group-hover:text-white transition-colors">
                    InterviewPilot
                </h2>
            </Link>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-light-100 hover:text-white transition-colors font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        href="/feedback"
                        className="text-light-100 hover:text-white transition-colors font-medium"
                    >
                        Feedbacks
                    </Link>
                </div>

                <div className="flex items-center gap-4 border-l border-light-800 pl-6 ml-2">
                    {user ? (
                        <UserProfileButton user={user} />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="text-light-100 hover:text-white transition-colors font-medium"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
