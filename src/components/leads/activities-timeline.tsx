"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, getInitials } from "@/lib/utils";
import { Phone, Mail, Users, MapPin, FileText, CheckCircle2 } from "lucide-react";

interface Activity {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    scheduledAt?: Date | null;
    completedAt?: Date | null;
    createdAt: Date;
    user: {
        name: string;
    };
}

interface ActivitiesTimelineProps {
    activities: Activity[];
}

const ACTIVITY_ICONS: Record<string, any> = {
    CALL: Phone,
    EMAIL: Mail,
    MEETING: Users,
    SITE_VISIT: MapPin,
    NOTE: FileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
    CALL: "text-blue-600 bg-blue-100",
    EMAIL: "text-purple-600 bg-purple-100",
    MEETING: "text-green-600 bg-green-100",
    SITE_VISIT: "text-orange-600 bg-orange-100",
    NOTE: "text-gray-600 bg-gray-100",
};

export function ActivitiesTimeline({ activities }: ActivitiesTimelineProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activities.map((activity, index) => {
                        const Icon = ACTIVITY_ICONS[activity.type] || FileText;
                        const colorClass = ACTIVITY_COLORS[activity.type] || "text-gray-600 bg-gray-100";

                        return (
                            <div key={activity.id} className="relative">
                                {/* Connecting Line */}
                                {index < activities.length - 1 && (
                                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border" />
                                )}

                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium">{activity.title}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    By {activity.user.name}
                                                </p>
                                            </div>
                                            {activity.completedAt && (
                                                <Badge variant="outline" className="gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>

                                        {activity.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {activity.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            {activity.scheduledAt && (
                                                <span>Scheduled: {formatDateTime(activity.scheduledAt)}</span>
                                            )}
                                            <span>Created: {formatDateTime(activity.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {activities.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No activities yet
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
