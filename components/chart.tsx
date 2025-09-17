import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface ActivityChartProps {
    completionDates: string[]; 
    title?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
    completionDates,
    title = "Activity Overview"
}) => {
    
    const generateDateRange = () => {
        const dates = [];
        const today = new Date();

        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        return dates;
    };

    const getCompletionCount = (date: string) => {
        return completionDates.filter(d => d === date).length;
    };

    const getColorClass = (count: number) => {
        if (count === 0) return 'bg-muted/30';
        if (count <= 2) return 'bg-green-200';
        if (count <= 4) return 'bg-green-400';
        if (count <= 6) return 'bg-green-600';
        return 'bg-green-800';
    };

    const dateRange = generateDateRange();
    const totalCompletions = completionDates.length;
    const activeDays = [...new Set(completionDates)].length;

    function calculateCurrentStreak(dates: string[]) {
        if (dates.length === 0) return 0;

        const sortedDates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
            return 0;
        }

        let streak = 0;
        const currentDate = new Date();

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (sortedDates.includes(dateStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    const currentStreak = calculateCurrentStreak(completionDates);

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{title}</span>
                </CardTitle>
                <CardDescription>
                    Habit completion activity over the past 3 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-xl font-bold text-foreground">{totalCompletions}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-foreground">{activeDays}</div>
                        <div className="text-xs text-muted-foreground">Active Days</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-foreground">{currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 lg:grid-cols-30 gap-1 mb-4">
                    {dateRange.map((date, index) => {
                        const count = getCompletionCount(date);
                        const dateObj = new Date(date);
                        return (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-sm ${getColorClass(count)} hover:ring-1 hover:ring-primary transition-all`}
                                title={`${dateObj.toLocaleDateString()}: ${count} completions`}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Less</span>
                    <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-sm bg-muted/30" />
                        <div className="w-3 h-3 rounded-sm bg-green-200" />
                        <div className="w-3 h-3 rounded-sm bg-green-400" />
                        <div className="w-3 h-3 rounded-sm bg-green-600" />
                        <div className="w-3 h-3 rounded-sm bg-green-800" />
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityChart;