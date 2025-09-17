"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "./ui/button";
import { LogoutButton } from "./logout";

interface NavClientProps {
    isLoggedIn: boolean;
    userId: string | null;
}

export default function NavClient({ isLoggedIn, userId }: NavClientProps) {
    return (
        <nav className="border-b border-border bg-background">
            <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">HabitTracker</span>
                </div>

                {/* Nav links */}
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-3">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full md:w-auto">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href={`/profile/${userId}`}>
                                <Button variant="ghost" className="w-full md:w-auto">
                                    Profile
                                </Button>
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" className="w-full md:w-auto">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-primary text-primary-foreground w-full md:w-auto">
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
