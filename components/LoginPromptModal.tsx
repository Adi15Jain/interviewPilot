"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, Sparkles } from "lucide-react";

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginPromptModal = ({ isOpen, onClose }: LoginPromptModalProps) => {
    const router = useRouter();

    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500">
                {/* Gradient border wrapper */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-primary-200/40 via-transparent to-primary-200/20 pointer-events-none" />

                <div className="relative bg-[#0a0d14]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(202,197,254,0.08)]">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 text-light-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <X className="size-4" />
                    </button>

                    {/* Content */}
                    <div className="flex flex-col items-center gap-6 text-center">
                        {/* Icon */}
                        <div className="relative">
                            <div className="size-20 rounded-2xl bg-primary-200/10 border border-primary-200/20 flex items-center justify-center">
                                <Lock className="size-9 text-primary-200" />
                            </div>
                            <div className="absolute inset-0 bg-primary-200/20 blur-3xl rounded-full -z-10" />
                            <div className="absolute -top-1 -right-1 size-6 rounded-full bg-primary-200/20 border border-primary-200/30 flex items-center justify-center">
                                <Sparkles className="size-3 text-primary-200" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Sign in to Continue
                            </h2>
                            <p className="text-light-400 text-sm leading-relaxed max-w-xs mx-auto">
                                Create an account or sign in to start your
                                AI-powered interview simulation and track your
                                progress.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 w-full mt-2">
                            <button
                                onClick={() => router.push("/sign-in")}
                                className="w-full h-12 rounded-xl bg-primary-200 text-dark-100 font-bold text-base hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(202,197,254,0.3)] hover:shadow-[0_0_40px_rgba(202,197,254,0.5)] active:scale-[0.98] relative overflow-hidden group"
                            >
                                <span className="relative z-10">Sign In</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                            <button
                                onClick={() => router.push("/sign-up")}
                                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 hover:border-primary-200/30 transition-all duration-300 active:scale-[0.98]"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Subtle footer */}
                        <p className="text-[11px] text-light-600 mt-1">
                            It only takes a few seconds to get started
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPromptModal;
