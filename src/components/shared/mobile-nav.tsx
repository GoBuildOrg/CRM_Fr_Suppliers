"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Package,
    ShoppingCart,
    Building2,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Quotations", href: "/quotations", icon: FileText },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Customers", href: "/customers", icon: Building2 },
    { name: "Inventory", href: "/inventory", icon: Package },
];

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
            <div className="flex items-center justify-between p-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src="/gobuild-logo.png"
                        alt="GoBuild Logo"
                        className="h-8 w-8 object-contain"
                    />
                    <span className="font-bold text-lg">GoBuild CSM</span>
                </div>

                {/* Mobile Menu Toggle */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <div className="flex flex-col h-full">
                            {/* Mobile Logo */}
                            <div className="border-b p-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/gobuild-logo.png"
                                        alt="GoBuild Logo"
                                        className="h-8 w-8 object-contain"
                                    />
                                    <span className="font-bold text-xl">GoBuild CSM</span>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-1 p-4">
                                {navigation.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* User Info */}
                            <div className="border-t p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-medium">
                                            DU
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">Demo User</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            demo@gobuild.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
