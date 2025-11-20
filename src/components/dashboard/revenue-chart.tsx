"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface RevenueChartProps {
    data: Array<{ month: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
    const maxRevenue = useMemo(
        () => Math.max(...data.map((d) => d.revenue), 0),
        [data]
    );

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2">
                    {data.map((item, index) => {
                        const heightPercentage = maxRevenue > 0
                            ? (item.revenue / maxRevenue) * 100
                            : 0;

                        return (
                            <div
                                key={index}
                                className="flex-1 flex flex-col items-center gap-2"
                            >
                                <div className="w-full flex flex-col items-center justify-end h-[250px]">
                                    <div className="text-xs font-medium mb-1 text-muted-foreground">
                                        ₹{(item.revenue / 1000).toFixed(0)}K
                                    </div>
                                    <div
                                        className="w-full bg-primary rounded-t-md transition-all hover:opacity-80"
                                        style={{ height: `${heightPercentage}%` }}
                                    />
                                </div>
                                <div className="text-xs text-center text-muted-foreground">
                                    {item.month}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {data.length === 0 && (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No revenue data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
