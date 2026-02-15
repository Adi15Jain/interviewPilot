"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { signOut as customSignOut } from "@/lib/actions/auth.action";
import type { User } from "@/types";

interface UserProfileButtonProps {
    user: User;
}

const UserProfileButton = ({ user }: UserProfileButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        // Clear custom JWT cookie (for email/password users)
        await customSignOut();
        // Clear NextAuth session (for Google users) and redirect
        await nextAuthSignOut({ callbackUrl: "/sign-in" });
    };

    const initials = user.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : user.email?.[0]?.toUpperCase() || "U";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full py-1.5 px-2 hover:bg-dark-300 transition-all cursor-pointer group"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-primary-200/30 group-hover:ring-primary-200/60 transition-all"
                    />
                ) : (
                    <div className="size-9 rounded-full bg-gradient-to-br from-primary-200 to-primary-200/60 flex items-center justify-center ring-2 ring-primary-200/30 group-hover:ring-primary-200/60 transition-all">
                        <span className="text-sm font-semibold text-dark-100">
                            {initials}
                        </span>
                    </div>
                )}
                <ChevronDown
                    className={`size-4 text-light-100 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#020408]/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 ring-1 ring-white/5">
                    {/* User Info Section */}
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center gap-3.5">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "User"}
                                    width={48}
                                    height={48}
                                    className="rounded-full ring-2 ring-primary-200/40"
                                />
                            ) : (
                                <div className="size-12 rounded-full bg-gradient-to-br from-primary-200 to-primary-200/60 flex items-center justify-center ring-2 ring-primary-200/40">
                                    <span className="text-base font-bold text-dark-100">
                                        {initials}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {user.name || "User"}
                                </p>
                                <p className="text-light-400 text-xs truncate mt-0.5">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 flex flex-col gap-1">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-light-100 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                        >
                            <UserIcon className="size-4 text-light-400 group-hover:text-primary-200 transition-colors" />
                            <span className="text-sm font-medium">
                                View Profile
                            </span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-light-100 hover:bg-white/5 hover:text-white transition-all cursor-pointer group"
                        >
                            <LogOut className="size-4 text-light-400 group-hover:text-primary-200 transition-colors" />
                            <span className="text-sm font-medium">
                                Sign out
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileButton;
