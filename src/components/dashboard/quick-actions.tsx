"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Package } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    const actions = [
        {
            title: "New Lead",
            description: "Create a new lead",
            icon: Plus,
            href: "/leads/new",
            color: "bg-blue-500",
        },
        {
            title: "New Quotation",
            description: "Generate a quote",
            icon: FileText,
            href: "/quotations/new",
            color: "bg-green-500",
        },
        {
            title: "Add Customer",
            description: "Register new customer",
            icon: Users,
            href: "/customers/new",
            color: "bg-purple-500",
        },
        {
            title: "Manage Inventory",
            description: "Update stock levels",
            icon: Package,
            href: "/inventory",
            color: "bg-orange-500",
        },
    ];

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {actions.map((action) => (
                        <Link key={action.title} href={action.href}>
                            <Button
                                variant="outline"
                                className="h-auto flex-col items-start p-4 w-full hover:bg-accent"
                            >
                                <div
                                    className={`${action.color} p-2 rounded-lg mb-2 text-white`}
                                >
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-sm">{action.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {action.description}
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
