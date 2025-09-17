"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false) 

    const handleLogin = async () => {
        
        setLoading(true)

        try {
            const { data } = await axios.post("/api/login", {
                email,
                password,
            })

            if (data.success) {
                toast.success("Login successful")

                router.refresh()

                setTimeout(() => {
                    router.push("/dashboard")
                }, 500)

            } else {
                toast.error(data.message || "Login failed")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong")
            } else {
                toast.error("An unknown error occurred")
            }
        } finally {
            setLoading(false)
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

                <Button onClick={handleLogin} className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </div>
        </div>
    )
}

export default LoginPage