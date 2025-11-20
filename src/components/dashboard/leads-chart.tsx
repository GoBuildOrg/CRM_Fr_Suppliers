"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface LeadsChartProps {
    data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
    NEW: "bg-blue-500",
    CONTACTED: "bg-yellow-500",
    QUALIFIED: "bg-green-500",
    PROPOSAL: "bg-purple-500",
    NEGOTIATION: "bg-orange-500",
    WON: "bg-emerald-600",
    LOST: "bg-red-500",
};

export function LeadsChart({ data }: LeadsChartProps) {
    const total = useMemo(
        () => data.reduce((sum, item) => sum + item.count, 0),
        [data]
    );

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Leads by Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => {
                        const percentage = total > 0 ? (item.count / total) * 100 : 0;

                        return (
                            <div key={item.status} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${STATUS_COLORS[item.status] || "bg-gray-500"
                                                }`}
                                        />
                                        <span className="font-medium">
                                            {item.status.charAt(0) +
                                                item.status.slice(1).toLowerCase().replace("_", " ")}
                                        </span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {item.count} ({percentage.toFixed(0)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${STATUS_COLORS[item.status] || "bg-gray-500"
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {data.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No leads data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
