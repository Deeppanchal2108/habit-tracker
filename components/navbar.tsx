import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { cookies } from 'next/headers';

import { Button } from './ui/button';
import { getUserIdFromToken } from '@/lib/token'; 
import { LogoutButton } from './logout';

export default async function Nav() {
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    const userId = token ? await getUserIdFromToken(token) : null;
    const isLoggedIn = !!userId;

    return (
        <nav className="border-b border-border bg-background">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">HabitTracker</span>
                </div>
                <div className="space-x-3 flex">
                    {isLoggedIn ? (
                    
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Link href={`/profile/${userId}`}>
                                <Button variant="ghost">Profile</Button>
                            </Link>
                      
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-primary text-primary-foreground">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}