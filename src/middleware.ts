import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Protect sensitive routes
    if (!session && (pathname.startsWith("/checkout") || pathname.startsWith("/wishlist") || pathname.startsWith("/orders"))) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin") && session?.user?.role !== "Admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/checkout/:path*", "/wishlist/:path*", "/orders/:path*", "/admin/:path*"],
};
