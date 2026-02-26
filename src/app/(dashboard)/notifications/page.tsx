"use client";

import { useState } from "react";
import { Bell, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    timestamp: Date;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "New Lead",
            message: "Acme Corp has shown interest in your quotation",
            type: "info",
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
        {
            id: "2",
            title: "Order Completed",
            message: "Order #12345 has been successfully delivered",
            type: "success",
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
            id: "3",
            title: "Low Stock Alert",
            message: "Widget A inventory is running low",
            type: "warning",
            read: true,
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
    ]);

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((n) => ({ ...n, read: true }))
        );
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case "success":
                return "border-l-4 border-green-500 bg-green-50";
            case "warning":
                return "border-l-4 border-yellow-500 bg-yellow-50";
            case "error":
                return "border-l-4 border-red-500 bg-red-50";
            default:
                return "border-l-4 border-blue-500 bg-blue-50";
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return "Just now";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your business activities
                    </p>
                </div>
                {notifications.some((n) => !n.read) && (
                    <Button
                        onClick={markAllAsRead}
                        variant="outline"
                        size="sm"
                    >
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`p-4 ${getTypeStyles(notification.type)} ${
                                !notification.read ? "font-semibold" : ""
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold">
                                        {notification.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {formatTime(notification.timestamp)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <Button
                                            onClick={() => markAsRead(notification.id)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => deleteNotification(notification.id)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
