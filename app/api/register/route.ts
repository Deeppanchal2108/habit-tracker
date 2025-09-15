import { NextResponse, NextRequest } from "next/server"

import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
export async function POST(req:Request) {
    try {
        const { name ,email, password} = await req.json()

        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, message: "All fields are required ",status: 400 }
               
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters long", status: 400 }
                
            )
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists ", status: 400 },
               
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json({ success: true, message: "User registered successfully" })
    } catch (error) {
   
        return NextResponse.json(
            { success: false, message: "Something went wrong", status: 500 },
            
        )
    }
}