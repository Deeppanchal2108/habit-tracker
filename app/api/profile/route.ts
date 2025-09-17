import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/token";

export async function GET(req: Request) {
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

        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get("id");

        if (!profileId) {
            return NextResponse.json(
                { success: false, message: "Profile ID is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: profileId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                habits: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    select: {
                        id: true,
                        name: true,
                        frequency: true,
                        createdAt: true,
                    },
                },
                completions: {
                    select: { completion_date: true },
                },
                followers: true,
                following: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: userId,
                    followedId: profileId,
                },
            },
        });

        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            recentHabits: user.habits,
            completions: user.completions.map(
                (c) => c.completion_date.toISOString().split("T")[0]
            ),
            isFollowing: !!follow, 
        };

        return NextResponse.json(
            { success: true, profile: data, currentUserId: userId },
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
