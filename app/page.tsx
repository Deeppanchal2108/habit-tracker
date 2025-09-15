import { Button } from "@/components/ui/button"
import Link from "next/link"
import Nav from "@/components/navbar"
export default function Home() {
  return (
    <div className="min-h-screen bg-background">

     <Nav/>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Track Your Habits
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Build better habits, track progress, and stay accountable with friends.
        </p>
        <div className="space-x-4">
          
          <Button className="bg-primary text-primary-foreground px-6 py-3">
            Get Started
          </Button>
          <Button variant="outline" className="px-6 py-3">
            Learn More
          </Button>
        </div>
      </main>
    </div>
  )
}