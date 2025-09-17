import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("token");

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json(
            { success: false, message: "Failed to log out" },
            { status: 500 }
        );
    }
}