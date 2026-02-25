"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    createOrderSchema,
    updateOrderSchema,
    updateOrderStatusSchema,
    recordPaymentSchema,
    type CreateOrderInput,
    type UpdateOrderInput,
    type UpdateOrderStatusInput,
    type RecordPaymentInput,
} from "@/lib/validations/order";

// Generate order number
function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
}

export async function getOrders(filters?: {
    status?: string;
    paymentStatus?: string;
    searchQuery?: string;
}) {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockOrders } = await import("@/lib/mock-data");
        console.log("📦 Returning mock orders (no database)");
        return mockOrders;
    }

    const where: any = {
        supplierCompanyId: session.user.supplierCompanyId,
    };

    if (filters?.status && filters.status !== "ALL") {
        where.status = filters.status;
    }

    if (filters?.paymentStatus && filters.paymentStatus !== "ALL") {
        where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.searchQuery) {
        where.OR = [
            { orderNumber: { contains: filters.searchQuery, mode: "insensitive" } },
            {
                customerCompany: {
                    name: { contains: filters.searchQuery, mode: "insensitive" },
                },
            },
        ];
    }

    const orders = await prisma.order.findMany({
        where,
        include: {
            customerCompany: {
                select: {
                    name: true,
                    contactPerson: true,
                },
            },
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
}

export async function getOrderById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const order = await prisma.order.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
        include: {
            customerCompany: true,
            siteAddress: true,
            lead: {
                select: {
                    title: true,
                },
            },
            quotation: {
                select: {
                    quotationNumber: true,
                },
            },
            items: {
                include: {
                    inventory: {
                        select: {
                            name: true,
                            sku: true,
                        },
                    },
                },
            },
            createdBy: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
}

export async function createOrder(data: CreateOrderInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = createOrderSchema.parse(data);
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
        data: {
            orderNumber,
            supplierCompanyId: session.user.supplierCompanyId,
            customerCompanyId: validatedData.customerCompanyId,
            quotationId: validatedData.quotationId,
            leadId: validatedData.leadId,
            siteAddressId: validatedData.siteAddressId,
            deliveryDate: validatedData.deliveryDate,
            deliveryAddress: validatedData.deliveryAddress,
            deliveryNotes: validatedData.deliveryNotes,
            subtotal: validatedData.subtotal,
            taxPercent: validatedData.taxPercent,
            taxAmount: validatedData.taxAmount,
            discount: validatedData.discount,
            total: validatedData.total,
            createdById: session.user.id,
            items: {
                create: validatedData.items as any,
            },
        },
        include: {
            items: true,
        },
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return order;
}

export async function updateOrder(data: UpdateOrderInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateOrderSchema.parse(data);
    const { id, items, ...updateData } = validatedData;

    const existingOrder = await prisma.order.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    // Update order and items if provided
    const order = await prisma.order.update({
        where: { id },
        data: {
            ...updateData,
            ...(items && {
                items: {
                    deleteMany: {},
                    create: items as any,
                },
            }),
        } as any,
        include: {
            items: true,
        },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);

    return order;
}

export async function updateOrderStatus(data: UpdateOrderStatusInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateOrderStatusSchema.parse(data);

    const order = await prisma.order.update({
        where: {
            id: validatedData.orderId,
        },
        data: {
            status: validatedData.status,
        },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${validatedData.orderId}`);

    return order;
}

export async function recordPayment(data: RecordPaymentInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = recordPaymentSchema.parse(data);

    const order = await prisma.order.findFirst({
        where: {
            id: validatedData.orderId,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    const newPaidAmount = order.paidAmount + validatedData.amount;

    // Update payment status
    let newPaymentStatus = order.paymentStatus;
    if (newPaidAmount >= order.total) {
        newPaymentStatus = "PAID";
    } else if (newPaidAmount > 0) {
        newPaymentStatus = "PARTIAL";
    }

    const updatedOrder = await prisma.order.update({
        where: { id: validatedData.orderId },
        data: {
            paidAmount: newPaidAmount,
            paymentStatus: newPaymentStatus,
        },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${validatedData.orderId}`);

    return updatedOrder;
}

export async function deleteOrder(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const existingOrder = await prisma.order.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    await prisma.order.delete({
        where: { id },
    });

    revalidatePath("/orders");

    return { success: true };
}

export async function getOrderStats() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const [totalOrders, pendingOrders, totalRevenue, recentOrders] = await Promise.all([
        prisma.order.count({
            where: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        }),
        prisma.order.count({
            where: {
                supplierCompanyId: session.user.supplierCompanyId,
                status: {
                    in: ["PENDING", "CONFIRMED"],
                },
            },
        }),
        prisma.order.aggregate({
            where: {
                supplierCompanyId: session.user.supplierCompanyId,
                status: {
                    not: "CANCELLED",
                },
            },
            _sum: {
                total: true,
            },
        }),
        prisma.order.findMany({
            where: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customerCompany: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    return {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        recentOrders,
    };
}
