import { z } from "zod";

export const createLeadSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.enum([
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "PROPOSAL",
        "NEGOTIATION",
        "WON",
        "LOST",
    ]),
    estimatedValue: z.number().min(0).optional(),
    probability: z.number().min(0).max(100).optional(),
    expectedCloseDate: z.string().optional(),
    source: z.string().optional(),
    customerCompanyId: z.string().min(1, "Customer is required"),
    assignedToId: z.string().optional(),
    siteAddressId: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial().merge(
    z.object({
        id: z.string(),
    })
);

export const createActivitySchema = z.object({
    type: z.enum(["CALL", "EMAIL", "MEETING", "SITE_VISIT", "NOTE"]),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    scheduledAt: z.string().optional(),
    leadId: z.string().min(1, "Lead is required"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
