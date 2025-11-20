import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// TEMPORARY: Set to true to bypass auth (for frontend testing without database)
const DEV_BYPASS_AUTH = true;

export async function middleware(request: NextRequest) {
    // BYPASS MODE: Allow all routes when database is not available
    if (DEV_BYPASS_AUTH) {
        console.log("⚠️  AUTH BYPASSED - Development mode, no database required");
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage =
        request.nextUrl.pathname.startsWith("/signin") ||
        request.nextUrl.pathname.startsWith("/signup");

    const isPublicPage = request.nextUrl.pathname === "/";

    if (isPublicPage) {
        return NextResponse.next();
    }

    // Redirect to signin if trying to access protected route without token
    if (!token && !isAuthPage) {
        const signInUrl = new URL("/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Redirect to dashboard if trying to access auth pages with token
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
