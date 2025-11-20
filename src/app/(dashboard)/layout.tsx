import { ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { MobileNav } from "@/components/shared/mobile-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileNav />
            <div className="lg:pl-64">
                <Navbar />
                <main className="p-4 sm:p-6 pt-20 lg:pt-6">{children}</main>
            </div>
        </div>
    );
}
