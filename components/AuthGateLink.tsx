"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import LoginPromptModal from "./LoginPromptModal";

interface AuthGateLinkProps {
    href: string;
    isAuthenticated: boolean;
    children: ReactNode;
    className?: string;
}

const AuthGateLink = ({
    href,
    isAuthenticated,
    children,
    className = "",
}: AuthGateLinkProps) => {
    const [showModal, setShowModal] = useState(false);

    if (isAuthenticated) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={className}
            >
                {children}
            </button>
            <LoginPromptModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default AuthGateLink;
