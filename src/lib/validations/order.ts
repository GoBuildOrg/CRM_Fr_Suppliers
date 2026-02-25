import { z } from "zod";

// ============================================================================
// ORDER STATUS TYPE & CONFIG (Type-Safe Pattern)
// ============================================================================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  isEditable: boolean;
}> = {
  PENDING: {
    label: "Pending",
    color: "#EAB308",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    description: "Order created, awaiting confirmation",
    isEditable: true,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    description: "Order confirmed and in preparation",
    isEditable: true,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#8B5CF6",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    description: "Order is being processed and packed",
    isEditable: true,
  },
  DELIVERED: {
    label: "Delivered",
    color: "#10B981",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    description: "Order has been delivered to customer",
    isEditable: false,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#EF4444",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    description: "Order has been cancelled",
    isEditable: false,
  },
};

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

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
    status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "DELIVERED", "CANCELLED"] as const).refine(
        (val): val is OrderStatus => true,
        "Invalid order status"
    ),
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
