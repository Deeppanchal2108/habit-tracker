'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';
import { HabitCard } from '@/components/habit-card';
import Link from 'next/link';
import Suggested from '@/components/suggestion';
import RecentActivity from '@/components/recent-activity';

function Dashboard() {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHabits = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/habit/all');
      if (response.data.success) {
        setHabits(response.data.habits);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch habits.');
      toast.error(error.response?.data?.message || 'Failed to fetch habits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-10">
       
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Habits</h1>
          <Link href="/habit/new">
            <Button>Create Habit</Button>
          </Link>
        </div>

        {error && (
          <div className="text-center text-red-500 p-4 border rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-muted animate-pulse rounded-lg"
              />
            ))
          ) : habits.length === 0 ? (
            <div className="text-center text-muted-foreground p-10 border border-dashed rounded-lg col-span-full">
              <p>You don't have any habits yet. Start by creating one!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onHabitUpdated={fetchHabits}
              />
            ))
          )}
        </div>

        <div>
          <Suggested />
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
