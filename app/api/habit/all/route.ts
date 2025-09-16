import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/token";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication failed. No token provided." },
                { status: 401 }
            );
        }

        const userId = await getUserIdFromToken(token);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication failed. Invalid token." },
                { status: 401 }
            );
        }
        const habits = await prisma.habit.findMany({
            where: {
                userId: userId,
            },
            include: {
                completions: true, 
            },
            orderBy: {
                createdAt: 'asc', 
            },
        });

        
        return NextResponse.json(
            {
                success: true,
                message: "Habits fetched successfully.",
                habits: habits,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error fetching habits:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}