import { z } from "zod";

export const quotationItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    unit: z.string().min(1, "Unit is required"),
    unitPrice: z.number().min(0, "Unit price must be non-negative"),
    inventoryId: z.string().optional(),
});

export const createQuotationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    customerCompanyId: z.string().min(1, "Customer is required"),
    leadId: z.string().optional(),
    validUntil: z.string().min(1, "Valid until date is required"),
    taxPercent: z.number().min(0).max(100).default(18),
    discount: z.number().min(0).default(0),
    terms: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(quotationItemSchema).min(1, "At least one item is required"),
});

export const updateQuotationSchema = createQuotationSchema.partial().merge(
    z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
    })
);

export type QuotationItemInput = z.infer<typeof quotationItemSchema>;
export type CreateQuotationInput = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>;
