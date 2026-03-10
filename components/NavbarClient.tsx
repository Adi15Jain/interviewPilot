"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import type { User } from "@/types";

interface NavbarClientProps {
    user: User | null;
    UserProfileButton: React.ComponentType<{ user: User }>;
}

const NavbarClient = ({ user, UserProfileButton }: NavbarClientProps) => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path;

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target as Node)
            ) {
                setMobileOpen(false);
            }
        };
        if (mobileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const navLinks = [
        { label: "History", href: "/history" },
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Community", href: "/community" },
    ];

    return (
        <>
            <nav className="flex items-center justify-between w-full px-5 md:px-8 py-3 sticky top-4 z-50 bg-[#020408]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-[#020408]/50 hover:border-primary-200/30 group/nav ring-1 ring-white/5">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 group transition-all"
                >
                    <div className="relative">
                        <Image
                            src="/logo.png"
                            alt="InterviewPilot Logo"
                            width={60}
                            height={60}
                            unoptimized
                            className="-my-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-primary-200/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>
                    <h2 className="text-primary-100 group-hover:text-white transition-colors duration-300 relative font-bold tracking-tight">
                        InterviewPilot
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-200 to-primary-100/50 group-hover:w-full transition-all duration-500" />
                    </h2>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative text-light-100 hover:text-white transition-all duration-300 font-semibold group ${
                                    isActive(link.href) ? "text-white" : ""
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-500 shadow-[0_0_10px_rgba(202,197,254,0.8)] ${
                                        isActive(link.href)
                                            ? "w-full"
                                            : "w-0 group-hover:w-full"
                                    }`}
                                />
                            </Link>
                        ))}
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

                {/* Mobile: Auth + Hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    {user ? (
                        <UserProfileButton user={user} />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="px-4 py-1.5 text-sm text-dark-100 bg-primary-200 font-bold rounded-full"
                        >
                            Sign In
                        </Link>
                    )}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <X className="size-5 text-white" />
                        ) : (
                            <Menu className="size-5 text-white" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
            )}

            {/* Mobile Menu Panel */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 right-0 h-full w-72 bg-[#0a0d14] border-l border-white/10 z-50 transform transition-transform duration-300 ease-out md:hidden ${
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <span className="text-sm font-black text-light-400 uppercase tracking-[0.2em]">
                            Menu
                        </span>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                            <X className="size-4 text-white" />
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <div className="flex flex-col p-4 gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                                    isActive(link.href)
                                        ? "bg-primary-200/10 text-white border border-primary-200/20"
                                        : "text-light-400 hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                            >
                                {isActive(link.href) && (
                                    <span className="size-2 rounded-full bg-primary-200 animate-pulse" />
                                )}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="mx-5 h-px bg-white/5" />

                    {/* Quick Actions */}
                    <div className="flex flex-col p-4 gap-1">
                        <Link
                            href="/interview"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-200 text-dark-100 font-black text-sm uppercase tracking-wider hover:bg-white transition-all"
                        >
                            Start Interview
                        </Link>
                    </div>

                    {/* Bottom Branding */}
                    <div className="mt-auto p-5 border-t border-white/5">
                        <p className="text-[10px] font-bold text-light-800 uppercase tracking-[0.2em] text-center">
                            InterviewPilot • AI Interview Platform
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavbarClient;
