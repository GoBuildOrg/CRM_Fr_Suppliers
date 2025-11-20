"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: string[];
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/signin");
            return;
        }

        if (requiredRole && !requiredRole.includes(session.user.role)) {
            router.push("/dashboard");
        }
    }, [session, status, router, requiredRole]);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    if (requiredRole && !requiredRole.includes(session.user.role)) {
        return null;
    }

    return <>{children}</>;
}
