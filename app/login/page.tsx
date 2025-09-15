"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Page() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        try {
            const { data } = await axios.post("/api/login", {
                email,
                password,
            })

            if (data.success) {
                toast.success("Login successful ")
                router.push("/dashboard") 

            } else {
                toast.error(data.message || "Login failed ")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong ")
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Login</h1>

                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button onClick={handleLogin} className="w-full">
                    Login
                </Button>
            </div>
        </div>
    )
}

export default Page
