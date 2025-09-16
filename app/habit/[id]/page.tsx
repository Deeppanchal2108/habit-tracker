'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

function EditHabitPage() {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchHabit = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/habit`, {
                params: { id }
            })

            if (response.data.success) {
                const { habit } = response.data
                setName(habit.name || '')
                setDescription(habit.description || '')
                setFrequency(habit.frequency || '')
                setCategory(habit.category || '')
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Something went wrong while fetching habit')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchHabit()
        }
    }, [id])

    const handleSubmit = async () => {
        try {
            const response = await axios.patch('/api/habit', {
                id,
                description,
                category
            })

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Something went wrong while updating habit')
            }
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Edit Habit</h1>

                <Input
                    placeholder="Habit name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />

                <Input
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Display the frequency as read-only text */}
                <div className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground">
                    <span className="text-sm text-muted-foreground">Frequency: </span>
                    <span className="font-medium">{frequency === 'DAILY' ? 'Daily' : 'Weekly'}</span>
                </div>

                <Input
                    placeholder="Category (optional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <Button onClick={handleSubmit} className="w-full" disabled={loading || !id}>
                    {loading ? 'Loading...' : 'Update Habit'}
                </Button>
            </div>
        </div>
    )
}

export default EditHabitPage