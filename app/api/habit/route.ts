import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/token";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
       

        if (!token) {
          
            return NextResponse.json(
                { success: false, message: "Authorization header missing" },
                { status: 401 }
            );
        }

        const userId = await getUserIdFromToken(token);
        // console.log("UserId retrieved:", userId);

        if (!userId) {
        
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const { name, description, frequency, category } = await req.json();
        // console.log("Request body:", { name, description, frequency, category });

        if (!name || !frequency) {
            
            return NextResponse.json(
                { success: false, message: "Habit name and frequency are required." },
                { status: 400 }
            );
        }

        const newHabit = await prisma.habit.create({
            data: {
                name,
                description,
                frequency,
                category,
                userId,
            },
        });
        // console.log("New habit created:", newHabit);

        return NextResponse.json(
            {
                success: true,
                message: "Habit created successfully",
                habit: newHabit,
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("Error in POST request:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
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

        const { id, description, category } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Habit ID is required" }, { status: 400 });
        }

        const habit = await prisma.habit.findUnique({ where: { id } });
        if (!habit || habit.userId !== userId) {
            return NextResponse.json({ success: false, message: "Habit not found or unauthorized" }, { status: 404 });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id },
            data: {
                description: description ?? habit.description,
                category: category ?? habit.category,
            },
        });

        return NextResponse.json(
            { success: true, message: "Habit updated successfully", habit: updatedHabit },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
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

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: "Habit ID is required" }, { status: 400 });
        }

        const habit = await prisma.habit.findUnique({ where: { id } });
        if (!habit || habit.userId !== userId) {
            return NextResponse.json({ success: false, message: "Habit not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, message: "Habit retrieved successfully", habit },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
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
        if (!userId) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Habit ID is required" }, { status: 400 });
        }

        const habit = await prisma.habit.findUnique({ where: { id } });
        if (!habit || habit.userId !== userId) {
            return NextResponse.json({ success: false, message: "Habit not found or unauthorized" }, { status: 404 });
        }

        await prisma.completion.deleteMany({
            where: { habitId: id },
        });
        
        await prisma.habit.delete({ where: { id } });

        return NextResponse.json(
            { success: true, message: "Habit deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}