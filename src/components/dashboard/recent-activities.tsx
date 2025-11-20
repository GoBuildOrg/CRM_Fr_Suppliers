"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, getInitials } from "@/lib/utils";

interface Activity {
    id: string;
    type: string;
    title: string;
    createdAt: Date;
    user: {
        name: string;
    };
    lead: {
        title: string;
        customerCompany: {
            name: string;
        };
    };
}

interface RecentActivitiesProps {
    activities: Activity[];
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
    CALL: "Call",
    EMAIL: "Email",
    MEETING: "Meeting",
    SITE_VISIT: "Site Visit",
    NOTE: "Note",
};

const ACTIVITY_TYPE_VARIANTS: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    CALL: "default",
    EMAIL: "secondary",
    MEETING: "default",
    SITE_VISIT: "outline",
    NOTE: "secondary",
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                        >
                            <Avatar>
                                <AvatarFallback>
                                    {getInitials(activity.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{activity.title}</p>
                                    <Badge variant={ACTIVITY_TYPE_VARIANTS[activity.type]}>
                                        {ACTIVITY_TYPE_LABELS[activity.type]}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {activity.lead.customerCompany.name} - {activity.lead.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDateTime(activity.createdAt)} by {activity.user.name}
                                </p>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No recent activities
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
