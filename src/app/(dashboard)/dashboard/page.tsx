import {
    getDashboardStats,
    getRecentActivities,
    getMonthlyRevenue,
    getLeadsByStatus,
} from "@/actions/dashboard";
import { StatsCard } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LeadsChart } from "@/components/dashboard/leads-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    AlertTriangle,
    Target,
    Info,
} from "lucide-react";

export default async function DashboardPage() {
    const [stats, activities, revenueData, leadsData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(),
        getMonthlyRevenue(),
        getLeadsByStatus(),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here&apos;s what&apos;s happening with your business today.
                </p>
            </div>

            {/* Demo Mode Banner */}
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900">Demo Mode Active</h3>
                    <p className="text-sm text-yellow-800 mt-1">
                        You are currently viewing the CRM in demo mode. Some services and features are not available in this mode. For full access to all features and services, please contact the administrator.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={stats.totalRevenue}
                    icon={DollarSign}
                    format="currency"
                    description="From delivered orders"
                />
                <StatsCard
                    title="Active Leads"
                    value={stats.activeLeads}
                    icon={TrendingUp}
                    description={`${stats.totalLeads} total leads`}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    description={`${stats.pendingOrders} pending`}
                />
                <StatsCard
                    title="Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    description="Unique customers"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <StatsCard
                    title="Conversion Rate"
                    value={stats.conversionRate}
                    icon={Target}
                    format="percentage"
                    description="Leads to won deals"
                />
                <StatsCard
                    title="Low Stock Alert"
                    value={stats.lowStockItems}
                    icon={AlertTriangle}
                    description="Items below minimum level"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-7">
                <RevenueChart data={revenueData} />
                <LeadsChart data={leadsData} />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid gap-4 md:grid-cols-7">
                <RecentActivities activities={activities} />
                <QuickActions />
            </div>
        </div>
    );
}
