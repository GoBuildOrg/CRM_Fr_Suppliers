export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    saveFile,
    validateImageFile,
    deleteFile,
} from "@/lib/image-utils";

/**
 * POST /api/upload
 * Upload images for inventory items
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        // Process each file
        for (const file of files) {
            // Validate file
            const validation = validateImageFile(file);
            if (!validation.valid) {
                errors.push(`${file.name}: ${validation.error}`);
                continue;
            }

            try {
                // Save file and get URL
                const url = await saveFile(file);
                uploadedUrls.push(url);
            } catch (error) {
                console.error("Error saving file:", error);
                errors.push(`${file.name}: Failed to save`);
            }
        }

        return NextResponse.json({
            success: true,
            urls: uploadedUrls,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/upload
 * Delete an uploaded image
 */
export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL required" },
                { status: 400 }
            );
        }

        const deleted = deleteFile(imageUrl);

        return NextResponse.json({
            success: deleted,
            message: deleted ? "Image deleted" : "Image not found",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        );
    }
}
