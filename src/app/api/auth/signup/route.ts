import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, companyName } = await req.json();

        // Validate input
        if (!name || !email || !password || !companyName) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create supplier company and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create supplier company
            const company = await tx.supplierCompany.create({
                data: {
                    name: companyName,
                    email: email,
                    status: "ACTIVE",
                },
            });

            // Create user with SUPPLIER_ADMIN role (first user of a company)
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "SUPPLIER_ADMIN",
                    supplierCompanyId: company.id,
                },
            });

            return { company, user };
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
