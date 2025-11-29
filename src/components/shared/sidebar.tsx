"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Package,
    ShoppingCart,
    UserCircle,
    Bell,
    Settings,
    TrendingUp,
    Brain,
} from "lucide-react";

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Vishnu",
        href: "/vishnu",
        icon: Brain,
    },
    {
        name: "Leads",
        href: "/leads",
        icon: TrendingUp,
    },
    {
        name: "Quotations",
        href: "/quotations",
        icon: FileText,
    },
    {
        name: "Inventory",
        href: "/inventory",
        icon: Package,
    },
    {
        name: "Orders",
        href: "/orders",
        icon: ShoppingCart,
    },
    {
        name: "Customers",
        href: "/customers",
        icon: Users,
    },
    {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card">
            {/* App Logo */}
            <div className="border-b p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center">
                        <img
                            src="/gobuild-logo.png"
                            alt="GoBuild Logo"
                            className="h-8 w-8 object-contain"
                        />
                    </div>
                    <span className="font-bold text-xl">GoBuild CSM</span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
