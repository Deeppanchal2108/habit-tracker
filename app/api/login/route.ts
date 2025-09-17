import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "all fields are required", status: 400 }
            )
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json(
                { success: false, message: "invalid credentials", status: 401 }
            )
        }

        const passValid = await bcrypt.compare(password, user.password)
        if (!passValid) {
            return NextResponse.json(
                { success: false, message: "invalid credentials", status: 401 }
            )
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        const res = NextResponse.json({ success: true, message: "login successful" })
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, 
            path: "/",
        })

        return res
       
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong", status: 500, error : error }
        )
    }
}
