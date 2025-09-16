'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from 'sonner'

function CreateHabitPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('DAILY')
  const [category, setCategory] = useState('')

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/habit', {
        name,
        description,
        frequency,
        category
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setFrequency('DAILY')
        setCategory('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error:any ) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Habit</h1>

        <Input
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
        </select>

        <Input
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full">
          Create Habit
        </Button>
      </div>
    </div>
  )
}

export default CreateHabitPage