"use client";

import {
    createContext,
    useCallback,
    useContext,
    type ReactNode
} from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type User = {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    company?: string;
    role?: string;
    goal?: string;
    phone?: string;
    profileCompleted?: boolean;
} | null;

type AuthContextValue = {
    user: User;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signInWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

    // Query current user from Convex when authenticated
    const currentUser = useQuery(
        api.users.currentUser,
        isAuthenticated ? {} : "skip"
    );

    const user: User = isAuthenticated && currentUser
        ? {
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
            company: currentUser.company,
            role: currentUser.role,
            goal: currentUser.goal,
            phone: currentUser.phone,
            profileCompleted: currentUser.profileCompleted,
        }
        : null;

    const signUp = useCallback(
        async (email: string, password: string, displayName: string) => {
            try {
                const formData = new FormData();
                formData.append("email", email);
                formData.append("password", password);
                formData.append("name", displayName);
                formData.append("flow", "signUp");
                await convexSignIn("password", formData);
                return { error: null };
            } catch (err) {
                return { error: err instanceof Error ? err.message : "Error al registrar" };
            }
        },
        [convexSignIn]
    );

    const signIn = useCallback(
        async (email: string, password: string) => {
            try {
                const formData = new FormData();
                formData.append("email", email);
                formData.append("password", password);
                formData.append("flow", "signIn");
                await convexSignIn("password", formData);
                return { error: null };
            } catch (err) {
                return { error: err instanceof Error ? err.message : "Error al iniciar sesión" };
            }
        },
        [convexSignIn]
    );

    const signInWithGoogle = useCallback(async () => {
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        await convexSignIn("google", { redirectTo });
    }, [convexSignIn]);

    const signOutFn = useCallback(async () => {
        await convexSignOut();
    }, [convexSignOut]);

    const resetPassword = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (email: string) => {
            // Convex Auth Password reset requires additional setup
            // For now, return a helpful message
            return { error: "Función de reset en desarrollo. Contacta soporte." };
        },
        []
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: isLoading,
                signUp,
                signIn,
                signInWithGoogle,
                resetPassword,
                signOut: signOutFn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
