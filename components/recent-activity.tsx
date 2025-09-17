"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";


interface SuggestedUser {
    id: string;
    name: string;
    email: string;
}
export default function RecentActivity() {
    const [friends, setFriends] = useState<SuggestedUser[]>([]);

    useEffect(() => {
        async function fetchFriends() {
            const {data} = await axios.get("/api/follow"); 
            
            if (data.success) {
                setFriends(data.following);
            }
        }
        fetchFriends();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Recent Activity of Friends</h2>
            {friends.length === 0 ? (
                <p>You’re not following anyone yet.</p>
            ) : (
                <ul className="space-y-2">
                    {friends.map((user) => (
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
