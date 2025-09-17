"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SuggestedUser {
    id: string;
    name: string;
    email: string;
}

export default function Suggested() {
    const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);

    useEffect(() => {
        async function fetchSuggestions() {
            const res = await fetch("/api/suggestions");
            const data = await res.json();
            if (data.success) {
                setSuggestions(data.suggestions);
            }
        }
        fetchSuggestions();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Suggested People to Follow</h2>
            {suggestions.length === 0 ? (
                <p>No suggestions available.</p>
            ) : (
                <ul className="space-y-2">
                    {suggestions.map((user) => (
                        <li
                            key={user.id}
                            className="p-2 border rounded-md hover:bg-muted/40 transition"
                        >
                            <Link href={`/profile/${user.id}`} className="block">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}