"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mockDashboardStats } from "@/lib/mock-data";

export async function getDashboardStats() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session (no database)
    if (!session?.user?.supplierCompanyId) {
        console.log("📊 Returning mock dashboard stats (no database)");
        return mockDashboardStats;
    }

    const supplierCompanyId = session.user.supplierCompanyId;

    // Parallel queries for better performance
    const [
        totalLeads,
        activeLeads,
        wonLeads,
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalCustomers,
        lowStockItems,
    ] = await Promise.all([
        // Total leads
        prisma.lead.count({
            where: {
                customerCompany: {
                    leads: {
                        some: {
                            assignedTo: {
                                supplierCompanyId,
                            },
                        },
                    },
                },
            },
        }),
        // Active leads (not won or lost)
        prisma.lead.count({
            where: {
                status: {
                    notIn: ["WON", "LOST"],
                },
                assignedTo: {
                    supplierCompanyId,
                },
            },
        }),
        // Won leads
        prisma.lead.count({
            where: {
                status: "WON",
                assignedTo: {
                    supplierCompanyId,
                },
            },
        }),
        // Total orders
        prisma.order.count({
            where: {
                supplierCompanyId,
            },
        }),
        // Pending orders
        prisma.order.count({
            where: {
                supplierCompanyId,
                status: {
                    in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
                },
            },
        }),
        // Total revenue from delivered orders
        prisma.order.aggregate({
            where: {
                supplierCompanyId,
                status: "DELIVERED",
            },
            _sum: {
                total: true,
            },
        }),
        // Total unique customers
        prisma.customerCompany.count({
            where: {
                orders: {
                    some: {
                        supplierCompanyId,
                    },
                },
            },
        }),
        // Low stock items
        prisma.inventoryItem.count({
            where: {
                supplierCompanyId,
                currentStock: {
                    lte: prisma.inventoryItem.fields.minStockLevel,
                },
            },
        }),
    ]);

    return {
        totalLeads,
        activeLeads,
        wonLeads,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        lowStockItems,
        conversionRate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0",
    };
}

export async function getRecentActivities() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockActivities } = await import("@/lib/mock-data");
        console.log("📋 Returning mock activities (no database)");
        return mockActivities;
    }

    const activities = await prisma.leadActivity.findMany({
        where: {
            user: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        },
        include: {
            lead: {
                include: {
                    customerCompany: true,
                },
            },
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    return activities;
}

export async function getMonthlyRevenue() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockRevenueData } = await import("@/lib/mock-data");
        console.log("📈 Returning mock revenue data (no database)");
        return mockRevenueData;
    }

    const supplierCompanyId = session.user.supplierCompanyId;

    // Get last 6 months of revenue
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
        where: {
            supplierCompanyId,
            status: "DELIVERED",
            createdAt: {
                gte: sixMonthsAgo,
            },
        },
        select: {
            total: true,
            createdAt: true,
        },
    });

    // Group by month
    const monthlyData = new Map<string, number>();

    orders.forEach((order) => {
        const monthKey = order.createdAt.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });

        const currentTotal = monthlyData.get(monthKey) || 0;
        monthlyData.set(monthKey, currentTotal + order.total);
    });

    // Convert to array format for charts
    return Array.from(monthlyData.entries()).map(([month, revenue]) => ({
        month,
        revenue,
    }));
}

export async function getLeadsByStatus() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockLeadsByStatus } = await import("@/lib/mock-data");
        console.log("📊 Returning mock leads distribution (no database)");
        return mockLeadsByStatus;
    }

    const leads = await prisma.lead.groupBy({
        by: ["status"],
        where: {
            assignedTo: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        },
        _count: {
            status: true,
        },
    });

    return leads.map((item) => ({
        status: item.status,
        count: item._count.status,
    }));
}
