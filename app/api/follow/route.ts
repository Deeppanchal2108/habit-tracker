import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/token";
import { cookies } from "next/headers";
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = await getUserIdFromToken(token);
        const { profileId } = await req.json();

        if (!userId || !profileId) {
            return NextResponse.json(
                { success: false, message: "Invalid user/profile id" },
                { status: 400 }
            );
        }

        if (userId === profileId) {
            return NextResponse.json({ success: false, message: "You cannot follow yourself." }, { status: 400 });
        }

        await prisma.follow.create({
            data: {
                followerId: userId,
                followedId: profileId,
            },
        });

        return NextResponse.json({ success: true, message: "Followed successfully" }, { status: 200 });
    } catch (err) { 
        if (err instanceof Error && "code" in err && err.code === "P2002") {
            return NextResponse.json({ success: false, message: "Already following" }, { status: 400 });
        }
        console.error("Follow error:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = await getUserIdFromToken(token);
        const { profileId } = await req.json();


        if (!userId || !profileId) {
            return NextResponse.json(
                { success: false, message: "Invalid user/profile id" },
                { status: 400 }
            );
        }


        await prisma.follow.deleteMany({
            where: {
                followerId: userId,
                followedId: profileId,
            },
        });

        return NextResponse.json({ success: true, message: "Unfollowed successfully" }, { status: 200 });
    } catch (err) {
        console.error("Unfollow error:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}



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

        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: {
                followed: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        const followingList = following.map((f) => f.followed);

        return NextResponse.json(
            { success: true, following: followingList },
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
