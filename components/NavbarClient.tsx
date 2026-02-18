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
        <nav className="flex items-center justify-between w-full px-8 py-3 sticky top-4 z-50 bg-[#020408]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-[#020408]/50 hover:border-primary-200/30 group/nav ring-1 ring-white/5">
            <Link
                href="/"
                className="flex items-center gap-2 group transition-all"
            >
                <div className="relative">
                    <Image
                        src="/logo.svg"
                        alt="InterviewPilot Logo"
                        width={36}
                        height={30}
                        className="group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-primary-200/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
                <h2 className="text-primary-100 group-hover:text-white transition-colors duration-300 relative font-bold tracking-tight">
                    InterviewPilot
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-200 to-primary-100/50 group-hover:w-full transition-all duration-500" />
                </h2>
            </Link>

            <div className="flex items-center gap-10">
                <div className="flex items-center gap-8">
                    {/* <Link
                        href="/"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-semibold group ${
                            isActive("/") ? "text-white" : ""
                        }`}
                    >
                        Home
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-500 shadow-[0_0_10px_rgba(202,197,254,0.8)] ${
                                isActive("/")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link> */}
                    <Link
                        href="/history"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-semibold group ${
                            isActive("/history") ? "text-white" : ""
                        }`}
                    >
                        History
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-500 shadow-[0_0_10px_rgba(202,197,254,0.8)] ${
                                isActive("/history")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                    <Link
                        href="/leaderboard"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-semibold group ${
                            isActive("/leaderboard") ? "text-white" : ""
                        }`}
                    >
                        Leaderboard
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-500 shadow-[0_0_10px_rgba(202,197,254,0.8)] ${
                                isActive("/leaderboard")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-4 border-l border-white/10 pl-8 ml-2">
                    {user ? (
                        <UserProfileButton user={user} />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="relative px-6 py-2 text-dark-100 bg-primary-200 hover:bg-white transition-all duration-300 font-bold rounded-full overflow-hidden group shadow-[0_0_20px_rgba(202,197,254,0.3)] hover:shadow-[0_0_25px_rgba(202,197,254,0.5)]"
                        >
                            <span className="relative z-10">Sign In</span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarClient;
