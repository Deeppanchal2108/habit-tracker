"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios"; 
import { toast } from "sonner";

export function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await axios.post("/api/logout");

            toast.success("Logged out successfully.");

            router.refresh();

            setTimeout(() => {
                router.push("/");
            }, 400);

        } catch (error) {
          
            const axiosError = error as AxiosError;

            toast.error(
               
                (axiosError.response?.data as { message?: string })?.message || "Failed to log out. Please try again."
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2"
        >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
    );
}