import React from 'react'

import { CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
function Nav() {
  return (
    <div>
          <nav className="border-b border-border">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold text-foreground">HabitTracker</span>
                  </div>
                  <div className="space-x-3">
                      <Link href={"/login"}>
                   
                      <Button variant="outline" className="text-muted-foreground">
                          Login
                          </Button>
                      </Link>

                                <Link href={"/signup"}>
                      <Button className="bg-primary text-primary-foreground">
                          Sign Up
                          </Button>
                      </Link>
                  </div>
              </div>
          </nav>
    </div>
  )
}

export default Nav
