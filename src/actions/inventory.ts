"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    createInventoryItemSchema,
    updateInventoryItemSchema,
    type CreateInventoryItemInput,
    type UpdateInventoryItemInput,
} from "@/lib/validations/inventory";

export async function getInventoryItems(category?: string) {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data if no session
    if (!session?.user?.supplierCompanyId) {
        const { mockInventory } = await import("@/lib/mock-data");
        console.log("📦 Returning mock inventory (no database)");
        return mockInventory;
    }

    const where: any = {
        supplierCompanyId: session.user.supplierCompanyId,
    };

    if (category && category !== "ALL") {
        where.category = category;
    }

    const items = await prisma.inventoryItem.findMany({
        where,
        orderBy: {
            name: "asc",
        },
    });

    return items;
}

// PUBLIC: Get inventory items visible on shop (no auth required)
export async function getPublicInventory(category?: string, searchQuery?: string) {
    const where: any = {
        isVisibleOnShop: true,
        isActive: true,
    };

    if (category && category !== "ALL") {
        where.category = category;
    }

    if (searchQuery) {
        where.OR = [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { brand: { contains: searchQuery, mode: "insensitive" } },
        ];
    }

    const items = await prisma.inventoryItem.findMany({
        where,
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            sku: true,
            name: true,
            shortDescription: true,
            category: true,
            brand: true,
            images: true,
            primaryImage: true,
            sellingPrice: true,
            unit: true,
        },
    });

    return items;
}

// PUBLIC: Get single inventory item for shop (no auth required)
export async function getPublicInventoryById(id: string) {
    const item = await prisma.inventoryItem.findFirst({
        where: {
            id,
            isVisibleOnShop: true,
            isActive: true,
        },
        include: {
            supplierCompany: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    city: true,
                    state: true,
                },
            },
        },
    });

    if (!item) {
        throw new Error("Product not found");
    }

    return item;
}

export async function getInventoryById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const item = await prisma.inventoryItem.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!item) {
        throw new Error("Inventory item not found");
    }

    return item;
}

export async function getLowStockItems() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock low stock items
    if (!session?.user?.supplierCompanyId) {
        const { mockInventory } = await import("@/lib/mock-data");
        return mockInventory.filter(item => item.currentStock <= item.minStockLevel);
    }

    const items = await prisma.$queryRaw<any[]>`
    SELECT * FROM "InventoryItem"
    WHERE "supplierCompanyId" = ${session.user.supplierCompanyId}
    AND "currentStock" <= "minStockLevel"
  `;

    return items;
}

export async function createInventoryItem(data: CreateInventoryItemInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = createInventoryItemSchema.parse(data);

    // Check if SKU already exists
    const existingSku = await prisma.inventoryItem.findFirst({
        where: {
            sku: validatedData.sku,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (existingSku) {
        throw new Error("SKU already exists");
    }

    const item = await prisma.inventoryItem.create({
        data: {
            ...validatedData,
            supplierCompanyId: session.user.supplierCompanyId,
        } as any,
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return item;
}

export async function updateInventoryItem(data: UpdateInventoryItemInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateInventoryItemSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const existingItem = await prisma.inventoryItem.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingItem) {
        throw new Error("Inventory item not found");
    }

    // Check SKU uniqueness if updating SKU
    if (updateData.sku && updateData.sku !== existingItem.sku) {
        const existingSku = await prisma.inventoryItem.findFirst({
            where: {
                sku: updateData.sku,
                supplierCompanyId: session.user.supplierCompanyId,
                id: { not: id },
            },
        });

        if (existingSku) {
            throw new Error("SKU already exists");
        }
    }

    const item = await prisma.inventoryItem.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/inventory");
    revalidatePath(`/inventory/${id}`);
    revalidatePath("/dashboard");

    return item;
}

export async function deleteInventoryItem(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const existingItem = await prisma.inventoryItem.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!existingItem) {
        throw new Error("Inventory item not found");
    }

    await prisma.inventoryItem.delete({
        where: { id },
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function adjustStock(
    id: string,
    quantity: number,
    type: "ADD" | "REMOVE"
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const item = await prisma.inventoryItem.findFirst({
        where: {
            id,
            supplierCompanyId: session.user.supplierCompanyId,
        },
    });

    if (!item) {
        throw new Error("Inventory item not found");
    }

    const newStock =
        type === "ADD"
            ? item.currentStock + quantity
            : item.currentStock - quantity;

    if (newStock < 0) {
        throw new Error("Insufficient stock");
    }

    const updatedItem = await prisma.inventoryItem.update({
        where: { id },
        data: {
            currentStock: newStock,
        },
    });

    revalidatePath("/inventory");
    revalidatePath(`/inventory/${id}`);

    return updatedItem;
}

export async function getInventoryCategories() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const categories = await prisma.inventoryItem.findMany({
        where: {
            supplierCompanyId: session.user.supplierCompanyId,
        },
        select: {
            category: true,
        },
        distinct: ["category"],
    });

    return categories.map((c) => c.category);
}
