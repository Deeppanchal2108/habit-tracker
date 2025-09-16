import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/token";
import { cookies } from "next/headers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = await getUserIdFromToken(token);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const { habitId } = await req.json();
        if (!habitId) {
            return NextResponse.json({ success: false, message: "habitId is required" }, { status: 400 });
        }

        const habit = await prisma.habit.findUnique({
            where: { id: habitId },
            select: { frequency: true, userId: true },
        });

        if (!habit || habit.userId !== userId) {
            return NextResponse.json({ success: false, message: "Habit not found or access denied" }, { status: 404 });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let weekStart: Date | null = null;
        if (habit.frequency === "WEEKLY") {
            const day = today.getUTCDay();

            
            const diff = (day === 0 ? -6 : 1) - day; 
            weekStart = new Date(today);
            weekStart.setUTCDate(today.getUTCDate() + diff);
            weekStart.setUTCHours(0, 0, 0, 0);
        }

        await prisma.completion.create({
            data: {
                habitId,
                userId,
                completion_date: today,
                week_start: weekStart,
            },
        });

        return NextResponse.json(
            { success: true, message: "Habit marked as complete" },
            { status: 201 }
        );

    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Habit already marked as complete for this period" },
                { status: 409 }
            );
        }

        console.error("Error marking habit complete:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
