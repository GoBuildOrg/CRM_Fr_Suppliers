import { z } from "zod";

// Site Address Schema
export const siteAddressSchema = z.object({
    name: z.string().min(1, "Site name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(6, "Valid pincode is required"),
    contactPerson: z.string().optional(),
    contactPhone: z.string().optional(),
});

// Create Customer Schema
export const createCustomerSchema = z.object({
    name: z.string().min(3, "Company name must be at least 3 characters"),
    email: z.string().email("Valid email is required").optional().or(z.literal("")),
    phone: z.string().min(10, "Valid phone number is required"),
    contactPerson: z.string().min(1, "Contact person name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    gstNumber: z.string().optional(),
});

// Update Customer Schema
export const updateCustomerSchema = createCustomerSchema.partial().merge(
    z.object({
        id: z.string(),
    })
);

// Add Site Address Schema
export const addSiteAddressSchema = siteAddressSchema.merge(
    z.object({
        customerCompanyId: z.string(),
    })
);

export type SiteAddressInput = z.infer<typeof siteAddressSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type AddSiteAddressInput = z.infer<typeof addSiteAddressSchema>;
