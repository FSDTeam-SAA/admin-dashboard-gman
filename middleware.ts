
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const publicRoutes = ["/login", "/forgot-password", "/update-password", "/verify-otp"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    const isStatic = pathname.startsWith("/_next") || pathname.includes(".");

    // Allow access to public routes and static assets without authentication
    if (isPublicRoute || isStatic) {
        // If user is admin and tries to access public routes, redirect to home
        if (token?.role === "admin" && isPublicRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login page
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Restrict /dashboard to admin role only
    if (pathname.startsWith("/")) {
        if (token.role !== "admin") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    // For non-dashboard routes, redirect admin users to home
    // if (token.role === "admin") {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // Allow non-admin users to proceed to non-dashboard routes
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};