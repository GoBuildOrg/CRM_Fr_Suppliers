"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    createQuotationSchema,
    updateQuotationSchema,
    type CreateQuotationInput,
    type UpdateQuotationInput,
} from "@/lib/validations/quotation";

function generateQuotationNumber(): string {
    const prefix = "QT";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
}

function calculateTotals(items: any[], taxPercent: number, discount: number) {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = (subtotal * taxPercent) / 100;
    const total = subtotal + taxAmount - discount;

    return {
        subtotal,
        taxAmount,
        total,
    };
}

export async function getQuotations(status?: string) {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockQuotations } = await import("@/lib/mock-data");
        console.log("💼 Returning mock quotations (no database)");
        return mockQuotations;
    }

    const where: any = {
        supplierCompanyId: session.user.supplierCompanyId,
    };

    if (status && status !== "ALL") {
        where.status = status;
    }

    const quotations = await prisma.quotation.findMany({
        where,
        include: {
            customerCompany: true,
            createdBy: true,
            lead: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return quotations;
}

export async function getQuotationById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const quotation = await prisma.quotation.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
        include: {
            customerCompany: {
                include: {
                    siteAddresses: true,
                },
            },
            supplierCompany: true,
            createdBy: true,
            lead: true,
            items: {
                include: {
                    inventory: true,
                },
            },
            orders: true,
        },
    });

    if (!quotation) {
        throw new Error("Quotation not found");
    }

    return quotation;
}

export async function createQuotation(data: CreateQuotationInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = createQuotationSchema.parse(data);

    const { subtotal, taxAmount, total } = calculateTotals(
        validatedData.items,
        validatedData.taxPercent,
        validatedData.discount
    );

    const quotationNumber = generateQuotationNumber();

    const quotation = await prisma.quotation.create({
        data: {
            quotationNumber,
            title: validatedData.title,
            description: validatedData.description,
            validUntil: new Date(validatedData.validUntil),
            subtotal,
            taxPercent: validatedData.taxPercent,
            taxAmount,
            discount: validatedData.discount,
            total,
            terms: validatedData.terms,
            notes: validatedData.notes,
            status: "DRAFT",
            supplierCompanyId: session.user.supplierCompanyId,
            customerCompanyId: validatedData.customerCompanyId,
            leadId: validatedData.leadId,
            createdById: session.user.id,
            items: {
                create: validatedData.items.map((item) => ({
                    itemName: item.itemName,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    total: item.quantity * item.unitPrice,
                    inventoryId: item.inventoryId,
                })),
            },
        },
        include: {
            items: true,
            customerCompany: true,
        },
    });

    revalidatePath("/quotations");
    revalidatePath("/dashboard");
    if (validatedData.leadId) {
        revalidatePath(`/leads/${validatedData.leadId}`);
    }

    return quotation;
}

export async function updateQuotation(data: UpdateQuotationInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateQuotationSchema.parse(data);
    const { id, items, ...updateData } = validatedData;

    const existingQuotation = await prisma.quotation.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingQuotation) {
        throw new Error("Quotation not found");
    }

    let calculatedTotals;
    if (items) {
        calculatedTotals = calculateTotals(
            items,
            updateData.taxPercent ?? existingQuotation.taxPercent,
            updateData.discount ?? existingQuotation.discount
        );
    }

    const quotation = await prisma.quotation.update({
        where: { id },
        data: {
            ...updateData,
            validUntil: updateData.validUntil ? new Date(updateData.validUntil) : undefined,
            ...(calculatedTotals && {
                subtotal: calculatedTotals.subtotal,
                taxAmount: calculatedTotals.taxAmount,
                total: calculatedTotals.total,
            }),
            ...(items && {
                items: {
                    deleteMany: {},
                    create: items.map((item) => ({
                        itemName: item.itemName,
                        description: item.description,
                        quantity: item.quantity,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice,
                        inventoryId: item.inventoryId,
                    })),
                },
            }),
        },
        include: {
            items: true,
            customerCompany: true,
        },
    });

    revalidatePath("/quotations");
    revalidatePath(`/quotations/${id}`);
    revalidatePath("/dashboard");

    return quotation;
}

export async function deleteQuotation(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const existingQuotation = await prisma.quotation.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingQuotation) {
        throw new Error("Quotation not found");
    }

    await prisma.quotation.delete({
        where: { id },
    });

    revalidatePath("/quotations");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function updateQuotationStatus(id: string, status: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const quotation = await prisma.quotation.update({
        where: { id },
        data: { status: status as any },
    });

    revalidatePath("/quotations");
    revalidatePath(`/quotations/${id}`);

    return quotation;
}
