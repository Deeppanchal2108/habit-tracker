'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'


function EditHabitPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [category, setCategory] = useState('')

    const [isFetching, setIsFetching] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchHabit = async () => {
        setIsFetching(true); 
        try {
            const response = await axios.get(`/api/habit`, {
                params: { id }
            });

            if (response.data.success) {
                const { habit } = response.data;
                setName(habit.name || '');
                setDescription(habit.description || '');
                setFrequency(habit.frequency || '');
                setCategory(habit.category || '');
            } else {
                toast.error(response.data.message);
              
                router.push('/dashboard');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Something went wrong while fetching habit');
            } else {
                toast.error('An unknown error occurred.');
            }
            router.push('/dashboard');
        } finally {
            setIsFetching(false); 
        }
    };
    useEffect(() => {
        if (id) {
            fetchHabit();
        }
    }, [id]);

    const handleSubmit = async () => {
        setIsUpdating(true); 
        try {
            const response = await axios.patch('/api/habit', {
                id,
                description,
                category
            });

            if (response.data.success) {
                toast.success(response.data.message);
                router.refresh();
                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Something went wrong while updating habit');
            } else {
                toast.error('An unknown error occurred.');
            }
        } finally {
            setIsUpdating(false); 
        }
    };
    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p>Loading habit details...</p>
            </div>
        );
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

                <div className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground">
                    <span className="text-sm text-muted-foreground">Frequency: </span>
                    <span className="font-medium">{frequency === 'DAILY' ? 'Daily' : 'Weekly'}</span>
                </div>

                <Input
                    placeholder="Category (optional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <Button onClick={handleSubmit} className="w-full" disabled={isUpdating || isFetching || !id}>
                    {isUpdating ? 'Updating...' : 'Update Habit'}
                </Button>
            </div>
        </div>
    );
}

export default EditHabitPage;