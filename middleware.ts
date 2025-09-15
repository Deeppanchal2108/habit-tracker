
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        // console.log("No token found. Redirecting to /login.");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        if (!process.env.JWT_SECRET) {
            // console.error("JWT_SECRET is not defined in environment variables.");
          
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        await jwtVerify(token, secret);

        console.log("Token successfully verified.");
        return NextResponse.next();

    } catch (err) {
        // console.error("Token verification failed. Redirecting to /login.", err);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};