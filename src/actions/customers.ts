"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    createCustomerSchema,
    updateCustomerSchema,
    addSiteAddressSchema,
    type CreateCustomerInput,
    type UpdateCustomerInput,
    type AddSiteAddressInput,
} from "@/lib/validations/customer";

export async function getCustomers(searchQuery?: string) {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user) {
        const { mockCustomers } = await import("@/lib/mock-data");
        console.log("👥 Returning mock customers (no database)");
        return mockCustomers;
    }

    const where: any = {};

    if (searchQuery) {
        where.OR = [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { contactPerson: { contains: searchQuery, mode: "insensitive" } },
            { phone: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    const customers = await prisma.customerCompany.findMany({
        where,
        include: {
            _count: {
                select: {
                    orders: true,
                    leads: true,
                    quotations: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return customers;
}

export async function getCustomerById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const customer = await prisma.customerCompany.findUnique({
        where: { id },
        include: {
            siteAddresses: true,
            leads: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    estimatedValue: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
            quotations: {
                select: {
                    id: true,
                    quotationNumber: true,
                    status: true,
                    total: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
            orders: {
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    total: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!customer) {
        throw new Error("Customer not found");
    }

    return customer;
}

export async function getCustomerStats(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const [orderStats, leadCount, quotationCount] = await Promise.all([
        prisma.order.aggregate({
            where: {
                customerCompanyId: id,
                status: {
                    not: "CANCELLED",
                },
            },
            _count: true,
            _sum: {
                total: true,
            },
        }),
        prisma.lead.count({
            where: {
                customerCompanyId: id,
            },
        }),
        prisma.quotation.count({
            where: {
                customerCompanyId: id,
            },
        }),
    ]);

    return {
        totalOrders: orderStats._count,
        totalRevenue: orderStats._sum.total || 0,
        averageOrderValue:
            orderStats._count > 0
                ? (orderStats._sum.total || 0) / orderStats._count
                : 0,
        totalLeads: leadCount,
        totalQuotations: quotationCount,
    };
}

export async function createCustomer(data: CreateCustomerInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const validatedData = createCustomerSchema.parse(data);

    // Check if phone already exists
    const existingCustomer = await prisma.customerCompany.findFirst({
        where: {
            phone: validatedData.phone,
        },
    });

    if (existingCustomer) {
        throw new Error("Customer with this phone number already exists");
    }

    const customer = await prisma.customerCompany.create({
        data: validatedData,
    });

    revalidatePath("/customers");

    return customer;
}

export async function updateCustomer(data: UpdateCustomerInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateCustomerSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const existingCustomer = await prisma.customerCompany.findUnique({
        where: { id },
    });

    if (!existingCustomer) {
        throw new Error("Customer not found");
    }

    // Check for phone conflict if updating phone
    if (updateData.phone && updateData.phone !== existingCustomer.phone) {
        const phoneExists = await prisma.customerCompany.findFirst({
            where: {
                phone: updateData.phone,
                id: { not: id },
            },
        });

        if (phoneExists) {
            throw new Error("Phone number already in use");
        }
    }

    const customer = await prisma.customerCompany.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);

    return customer;
}

export async function deleteCustomer(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const existingCustomer = await prisma.customerCompany.findUnique({
        where: { id },
    });

    if (!existingCustomer) {
        throw new Error("Customer not found");
    }

    await prisma.customerCompany.delete({
        where: { id },
    });

    revalidatePath("/customers");

    return { success: true };
}

export async function addSiteAddress(data: AddSiteAddressInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const validatedData = addSiteAddressSchema.parse(data);

    const siteAddress = await prisma.siteAddress.create({
        data: validatedData,
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/${validatedData.customerCompanyId}`);

    return siteAddress;
}

export async function getSiteAddresses(customerCompanyId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const siteAddresses = await prisma.siteAddress.findMany({
        where: {
            customerCompanyId,
        },
        orderBy: {
            name: "asc",
        },
    });

    return siteAddresses;
}

export async function getCustomerOrders(customerCompanyId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const orders = await prisma.order.findMany({
        where: {
            customerCompanyId,
        },
        include: {
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
}
