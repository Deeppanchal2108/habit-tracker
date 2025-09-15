'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function SignUpPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const { data } = await axios.post('/api/register', {
                name,
                email,
                password,
            })

            if (data.success) {
                toast.success('Registration successful!')
                setName('')
                setEmail('')
                setPassword('')
            } else {
                toast.error(data.message || 'Registration failed')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>

                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <Button onClick={handleSubmit} className="w-full" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </div>
        </div>
    )
}

export default SignUpPage
