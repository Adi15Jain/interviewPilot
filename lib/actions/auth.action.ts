"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
    hashPassword,
    verifyPassword,
    createToken,
    verifyToken,
    SESSION_DURATION,
} from "@/lib/auth";
import { auth, signOut as nextAuthSignOut } from "@/lib/auth.config";
import { User, SignInParams, SignUpParams } from "@/types";

// Set session cookie (for credentials login fallback)
export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set("session", token, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: SignUpParams) {
    const { name, email, password } = params;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const password = idToken;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };
        }

        if (!user.password) {
            return {
                success: false,
                message:
                    "This account uses Google sign-in. Please sign in with Google.",
            };
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return {
                success: false,
                message: "Invalid credentials. Please try again.",
            };
        }

        const token = await createToken(user.id);
        await setSessionCookie(token);

        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (error: any) {
        console.error("Error signing in:", error);

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Sign out user - clears both NextAuth session and custom cookie
export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

// Get current user - checks NextAuth session first, falls back to custom JWT
export async function getCurrentUser(): Promise<User | null> {
    // First check NextAuth session
    try {
        const session = await auth();
        if (session?.user) {
            // Fetch full user data from DB to include onboardingComplete
            const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id! },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    profileURL: true,
                    createdAt: true,
                    onboardingComplete: true,
                },
            });
            if (dbUser) {
                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    image:
                        dbUser.image ||
                        dbUser.profileURL ||
                        session.user.image ||
                        undefined,
                    createdAt: dbUser.createdAt,
                    onboardingComplete: dbUser.onboardingComplete,
                };
            }
            return {
                id: session.user.id!,
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || undefined,
            };
        }
    } catch (error) {
        // NextAuth session not available, fall through to JWT check
    }

    // Fallback: Check custom JWT cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const payload = await verifyToken(sessionCookie);
        if (!payload) return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                profileURL: true,
                createdAt: true,
                onboardingComplete: true,
            },
        });

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || user.profileURL || undefined,
            createdAt: user.createdAt,
            onboardingComplete: user.onboardingComplete,
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

// Get random users with images
export async function getRandomUsers(limit: number = 4): Promise<User[]> {
    try {
        // Fetch random users who have an image
        const users = await prisma.$queryRaw<any[]>`
            SELECT id, name, email, image, "profileURL"
            FROM users
            WHERE image IS NOT NULL OR "profileURL" IS NOT NULL
            ORDER BY RANDOM()
            LIMIT ${limit}
        `;

        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || user.profileURL || undefined,
        }));
    } catch (error) {
        console.error("Error getting random users:", error);
        return [];
    }
}

export async function completeOnboarding(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { onboardingComplete: true },
        });
        return { success: true };
    } catch (error) {
        console.error("Error completing onboarding:", error);
        return { success: false };
    }
}
