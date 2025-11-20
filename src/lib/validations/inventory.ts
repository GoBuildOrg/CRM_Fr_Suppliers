import { z } from "zod";

export const createInventoryItemSchema = z.object({
    sku: z.string().min(3, "SKU must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    unit: z.string().min(1, "Unit is required"),
    currentStock: z.number().min(0, "Stock cannot be negative"),
    minStockLevel: z.number().min(0, "Min stock cannot be negative"),
    maxStockLevel: z.number().min(0, "Max stock cannot be negative").optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative"),
    sellingPrice: z.number().min(0, "Selling price cannot be negative"),
    reorderPoint: z.number().min(0).optional(),
    // New fields for images and shop
    images: z.array(z.string()).default([]),
    primaryImage: z.string().optional(),
    isVisibleOnShop: z.boolean().default(false),
    shortDescription: z.string().max(200, "Short description must be under 200 characters").optional(),
    brand: z.string().optional(),
    specifications: z.string().optional(), // JSON string
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial().merge(
    z.object({
        id: z.string(),
    })
);

export const adjustStockSchema = z.object({
    inventoryId: z.string(),
    quantity: z.number(),
    type: z.enum(["ADD", "REMOVE"]),
    reason: z.string().optional(),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
