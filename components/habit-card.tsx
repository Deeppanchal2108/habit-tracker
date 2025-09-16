// components/HabitCard.tsx
'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';

const isCompletedForPeriod = (
    completions: { completion_date: string; week_start?: string | null }[],
    frequency: string
): boolean => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (frequency === "DAILY") {
        return completions.some(c => {
            const completed = new Date(c.completion_date);
            return completed.getTime() === today.getTime();
        });
    }

    if (frequency === "WEEKLY") {
        
        const day = today.getUTCDay();
        const diff = (day === 0 ? -6 : 1) - day;
        const weekStart = new Date(today);
        weekStart.setUTCDate(today.getUTCDate() + diff);
        weekStart.setUTCHours(0, 0, 0, 0);

        return completions.some(c => {
            if (!c.week_start) return false;
            const completedWeekStart = new Date(c.week_start);
            return completedWeekStart.getTime() === weekStart.getTime();
        });
    }

    return false;
};


type HabitCardProps = {
    habit: {
        id: string;
        name: string;
        description: string | null;
        frequency: string;
        completions: { completion_date: string }[];
    };
    onHabitUpdated: () => void;
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onHabitUpdated }) => {
    const [loading, setLoading] = useState(false);
    const completedToday = isCompletedForPeriod(habit.completions, habit.frequency);

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/habit/completion', { habitId: habit.id });
            if (response.data.success) {
                toast.success('Habit marked as complete for today!');
                onHabitUpdated(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to mark habit as complete.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/habit`, {
                data: {
                id :habit.id
            }
            });
            if (response.data.success) {
                toast.success('Habit deleted successfully!');
                onHabitUpdated(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete habit.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                    <span className="text-xs font-medium uppercase text-primary-600 mt-1">{habit.frequency}</span>
                </div>
                <div className="flex space-x-2">
                    <Link href={`/habit/${habit.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <Button onClick={handleDelete} variant="destructive" size="sm" disabled={loading}>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <Button onClick={handleCheckIn} disabled={completedToday || loading}>
                    {completedToday ? 'Completed' : 'Mark Complete'}
                </Button>
            </div>
        </div>
    );
};