"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";
import { Button } from "./ui/button";

const LogoutButton = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLogout = () => {
        startTransition(async () => {
            const result = await signOut();
            router.push("/sign-in");
        });
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isPending}
            variant="ghost"
            className="text-light-100 hover:bg-dark-300 hover:text-white transition-all cursor-pointer rounded-full px-4"
        >
            <LogOut className="size-4 mr-2" />
            {isPending ? "Logging out..." : "Logout"}
        </Button>
    );
};

export default LogoutButton;
