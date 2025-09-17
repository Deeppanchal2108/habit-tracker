import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/token";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = await getUserIdFromToken(token);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Get all people the user already follows
        const followingIds = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });

        const followingSet = followingIds.map((f) => f.followedId);

        const suggestions = await prisma.user.findMany({
            where: {
                NOT: {
                    id: { in: [userId, ...followingSet] },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            take: 5,
        });

        return NextResponse.json(
            { success: true, suggestions },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
