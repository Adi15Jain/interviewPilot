"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import type { User } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/constants";

interface NavbarClientProps {
    user: User | null;
    UserProfileButton: React.ComponentType<{ user: User }>;
}

const NavbarClient = ({ user, UserProfileButton }: NavbarClientProps) => {
    const pathname = usePathname();
    const [langOpen, setLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState("en");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        const stored = localStorage.getItem("interviewpilot-lang");
        if (stored) setSelectedLang(stored);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageSelect = (code: string) => {
        setSelectedLang(code);
        localStorage.setItem("interviewpilot-lang", code);
        // Dispatch storage event so other components can react
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: "interviewpilot-lang",
                newValue: code,
            }),
        );
        setLangOpen(false);
    };

    const currentLang = SUPPORTED_LANGUAGES.find(
        (l) => l.code === selectedLang,
    );

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
                    <Link
                        href="/community"
                        className={`relative text-light-100 hover:text-white transition-all duration-300 font-semibold group ${
                            isActive("/community") ? "text-white" : ""
                        }`}
                    >
                        Community
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary-200 transition-all duration-500 shadow-[0_0_10px_rgba(202,197,254,0.8)] ${
                                isActive("/community")
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                </div>

                {/* Language Switcher */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-200/30 transition-all duration-300 text-light-100 hover:text-white"
                    >
                        <span className="text-base">
                            {currentLang?.flag || "🌐"}
                        </span>
                        <Globe className="size-4" />
                    </button>

                    {langOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0d14] backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() =>
                                        handleLanguageSelect(lang.code)
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                                        selectedLang === lang.code
                                            ? "bg-primary-200/15 text-white"
                                            : "text-light-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="text-sm font-medium">
                                        {lang.name}
                                    </span>
                                    {selectedLang === lang.code && (
                                        <span className="ml-auto size-2 rounded-full bg-primary-200" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
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
