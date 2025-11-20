import { z } from "zod";

// Order Item Schema
export const orderItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    unit: z.string().min(1, "Unit is required"),
    unitPrice: z.number().min(0, "Unit price cannot be negative"),
    total: z.number().min(0, "Total cannot be negative"),
    inventoryId: z.string().optional(),
});

// Create Order Schema
export const createOrderSchema = z.object({
    customerCompanyId: z.string().min(1, "Customer is required"),
    quotationId: z.string().optional(),
    leadId: z.string().optional(),
    siteAddressId: z.string().optional(),
    deliveryDate: z.date().optional(),
    deliveryAddress: z.string().optional(),
    deliveryNotes: z.string().optional(),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    subtotal: z.number().min(0),
    taxPercent: z.number().min(0).max(100),
    taxAmount: z.number().min(0),
    discount: z.number().min(0),
    total: z.number().min(0),
});

// Update Order Schema
export const updateOrderSchema = z.object({
    id: z.string(),
    customerCompanyId: z.string().optional(),
    siteAddressId: z.string().optional(),
    deliveryDate: z.date().optional(),
    deliveryAddress: z.string().optional(),
    deliveryNotes: z.string().optional(),
    items: z.array(orderItemSchema).optional(),
    subtotal: z.number().min(0).optional(),
    taxPercent: z.number().min(0).max(100).optional(),
    taxAmount: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
});

// Update Order Status Schema
export const updateOrderStatusSchema = z.object({
    orderId: z.string(),
    status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "DELIVERED", "CANCELLED"]),
});

// Record Payment Schema
export const recordPaymentSchema = z.object({
    orderId: z.string(),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    paymentDate: z.date().optional(),
    paymentMethod: z.string().optional(),
    notes: z.string().optional(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
