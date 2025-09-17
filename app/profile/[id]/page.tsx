"use client";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ActivityChart from "@/components/chart";
import { Badge } from "@/components/ui/badge";
import { User, Users, UserPlus, Loader2, Target } from "lucide-react"
interface RecentHabit {
    id: string;
    name: string;
    frequency: string;
    description?: string | null; 
}

interface Profile {
    id: string;
    name: string;
    email: string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    completions: string[];
    recentHabits: RecentHabit[];
}

export default function ProfilePage() {
    const params = useParams();
    const id = params.id as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get(`/api/profile`, { params: { id } });
                if (!data.success) {
                    setError(data.message || "Failed to fetch profile.");
                    setLoading(false);
                    return;
                }
                setProfile(data.profile);
                setCurrentUserId(data.currentUserId);
                setIsFollowing(data.profile.isFollowing);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [id]);

    async function handleFollowToggle() {
        if (!profile) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {

                const { data } = await axios.delete("/api/follow", {
                    data: { profileId: profile.id },
                });
                if (data.success) {
                    toast.success("Unfollowed successfully");
                    setIsFollowing(false);
                 
                    setProfile((prev) => prev ? {
                        ...prev,
                        followersCount: prev.followersCount - 1,
                    } : null);
                } else {
                    toast.error(data.message || "Unfollow failed");
                }
            } else {
            
                const { data } = await axios.post("/api/follow", {
                    profileId: profile.id,
                });
                if (data.success) {
                    toast.success("Followed successfully");
                    setIsFollowing(true);
                    setProfile((prev) => prev ? {
                        ...prev,
                        followersCount: prev.followersCount + 1,
                    } : null);
                } else {
                    toast.error(data.message || "Follow failed");
                }
            }
        } catch (err) {
            console.error("Follow toggle failed", err);
            toast.error("Something went wrong");
        } finally {
            setFollowLoading(false);
        }
    }

    if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;
    if (error) return <p className="text-center mt-20">{error}</p>;
    if (!profile) return <p className="text-center mt-20">No profile found</p>;

    const getInitials = (name: string) =>
        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <Card className="mb-4">
                    <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                                    {getInitials(profile.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                                <p className="text-muted-foreground mb-3">{profile.email}</p>

                                <div className="flex gap-4 mb-3">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">{profile.followersCount}</span> followers
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">{profile.followingCount}</span> following
                                    </div>
                                </div>

                                {profile.id !== currentUserId && (
                                    <Button
                                        className="w-full sm:w-auto"
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        variant={isFollowing ? "secondary" : "default"}
                                    >
                                        {followLoading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : isFollowing ? (
                                            <User className="h-4 w-4 mr-2" />
                                        ) : (
                                            <UserPlus className="h-4 w-4 mr-2" />
                                        )}
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Button>
                                )}

                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ActivityChart completionDates={profile.completions || []} title="Activity Overview" />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Target className="h-5 w-5" />
                            <span>Recent Habits</span>
                        </CardTitle>
                        <CardDescription>
                            Current active habits and their frequencies
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {profile.recentHabits && profile.recentHabits.length > 0 ? (
                            <div className="space-y-4">
                                {profile.recentHabits.map((habit) => (
                                    <div key={habit.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <div>
                                                <h4 className="font-medium text-foreground">{habit.name}</h4>
                                                {habit.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className={""}>
                                            {habit.frequency}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <Target className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="font-medium text-foreground mb-2">No habits yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    This user has not created any habits yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}