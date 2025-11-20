"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    createLeadSchema,
    updateLeadSchema,
    createActivitySchema,
    type CreateLeadInput,
    type UpdateLeadInput,
    type CreateActivityInput,
} from "@/lib/validations/lead";

export async function getLeads(status?: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        // DEV MODE: Return mock data if no session
        const { mockLeads } = await import("@/lib/mock-data");
        console.log("📋 Returning mock leads (no database)");
        return mockLeads;
    }

    const where: any = {
        assignedTo: {
            supplierCompanyId: session.user.supplierCompanyId,
        },
    };

    if (status && status !== "ALL") {
        where.status = status;
    }

    const leads = await prisma.lead.findMany({
        where,
        include: {
            customerCompany: true,
            assignedTo: true,
            siteAddress: true,
            activities: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 3,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return leads;
}

export async function getLeadById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const lead = await prisma.lead.findFirst({
        where: {
            id,
            assignedTo: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        },
        include: {
            customerCompany: {
                include: {
                    siteAddresses: true,
                },
            },
            assignedTo: true,
            siteAddress: true,
            activities: {
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            quotations: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
            orders: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            },
        },
    });

    if (!lead) {
        throw new Error("Lead not found");
    }

    return lead;
}

export async function createLead(data: CreateLeadInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const validatedData = createLeadSchema.parse(data);

    // Set assignedTo to current user if not specified
    const assignedToId = validatedData.assignedToId || session.user.id;

    const lead = await prisma.lead.create({
        data: {
            title: validatedData.title,
            description: validatedData.description,
            status: validatedData.status,
            estimatedValue: validatedData.estimatedValue,
            probability: validatedData.probability,
            expectedCloseDate: validatedData.expectedCloseDate
                ? new Date(validatedData.expectedCloseDate)
                : undefined,
            source: validatedData.source,
            customerCompanyId: validatedData.customerCompanyId,
            assignedToId,
            siteAddressId: validatedData.siteAddressId,
        },
        include: {
            customerCompany: true,
            assignedTo: true,
        },
    });

    revalidatePath("/leads");
    revalidatePath("/dashboard");

    return lead;
}

export async function updateLead(data: UpdateLeadInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateLeadSchema.parse(data);
    const { id, ...updateData } = validatedData;

    // Verify lead belongs to user's company
    const existingLead = await prisma.lead.findFirst({
        where: {
            id,
            assignedTo: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        },
    });

    if (!existingLead) {
        throw new Error("Lead not found");
    }

    const lead = await prisma.lead.update({
        where: { id },
        data: {
            ...updateData,
            expectedCloseDate: updateData.expectedCloseDate
                ? new Date(updateData.expectedCloseDate)
                : undefined,
        },
        include: {
            customerCompany: true,
            assignedTo: true,
        },
    });

    revalidatePath("/leads");
    revalidatePath(`/leads/${id}`);
    revalidatePath("/dashboard");

    return lead;
}

export async function deleteLead(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.supplierCompanyId) {
        throw new Error("Unauthorized");
    }

    // Verify lead belongs to user's company
    const existingLead = await prisma.lead.findFirst({
        where: {
            id,
            assignedTo: {
                supplierCompanyId: session.user.supplierCompanyId,
            },
        },
    });

    if (!existingLead) {
        throw new Error("Lead not found");
    }

    await prisma.lead.delete({
        where: { id },
    });

    revalidatePath("/leads");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function createActivity(data: CreateActivityInput) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const validatedData = createActivitySchema.parse(data);

    const activity = await prisma.leadActivity.create({
        data: {
            type: validatedData.type,
            title: validatedData.title,
            description: validatedData.description,
            scheduledAt: validatedData.scheduledAt
                ? new Date(validatedData.scheduledAt)
                : undefined,
            leadId: validatedData.leadId,
            userId: session.user.id,
        },
        include: {
            user: true,
            lead: {
                include: {
                    customerCompany: true,
                },
            },
        },
    });

    revalidatePath(`/leads/${validatedData.leadId}`);
    revalidatePath("/dashboard");

    return activity;
}

export async function completeActivity(activityId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const activity = await prisma.leadActivity.update({
        where: { id: activityId },
        data: {
            completedAt: new Date(),
        },
    });

    revalidatePath(`/leads/${activity.leadId}`);

    return activity;
}

export async function getTeamMembers() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data
    if (!session?.user?.supplierCompanyId) {
        return [{ id: "1", name: "Demo User", email: "demo@gobuild.com", role: "SUPPLIER_ADMIN" }];
    }

    const users = await prisma.user.findMany({
        where: {
            supplierCompanyId: session.user.supplierCompanyId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return users;
}

export async function getCustomers() {
    const session = await getServerSession(authOptions);

    // DEV MODE: Return mock data
    if (!session?.user?.supplierCompanyId) {
        return [
            { id: "1", name: "ABC Constructions", siteAddresses: [] },
            { id: "2", name: "XYZ Builders", siteAddresses: [] },
        ];
    }

    const customers = await prisma.customerCompany.findMany({
        include: {
            siteAddresses: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return customers;
}
