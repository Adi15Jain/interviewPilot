"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@/types";

interface NavbarClientProps {
    user: User | null;
    UserProfileButton: React.ComponentType<{ user: User }>;
}

const NavbarClient = ({ user, UserProfileButton }: NavbarClientProps) => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="flex items-center justify-between w-full py-4 sticky top-0 z-50 bg-dark-100/80 backdrop-blur-md border-b border-light-800/20">
            <Link
                href="/"
                className="flex items-center gap-2 group transition-all"
            >
                <div className="relative">
                    <Image
                        src="/logo.svg"
                        alt="InterviewPilot Logo"
                        width={38}
                        height={32}
                        className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-primary-200/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <h2 className="text-primary-100 group-hover:text-white transition-colors duration-300 relative">
                    InterviewPilot
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-200 group-hover:w-full transition-all duration-300" />
                </h2>
            </Link>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-medium group ${
                            isActive("/") ? "text-white" : ""
                        }`}
                    >
                        Home
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-300 ${
                                isActive("/")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                    <Link
                        href="/feedback"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-medium group ${
                            isActive("/feedback") ? "text-white" : ""
                        }`}
                    >
                        Feedbacks
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-300 ${
                                isActive("/feedback")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-4 border-l border-light-800 pl-6 ml-2">
                    {user ? (
                        <UserProfileButton user={user} />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="relative px-4 py-2 text-light-100 hover:text-white transition-all duration-300 font-medium group"
                        >
                            <span className="relative z-10">Sign In</span>
                            <span className="absolute inset-0 bg-primary-200/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarClient;
