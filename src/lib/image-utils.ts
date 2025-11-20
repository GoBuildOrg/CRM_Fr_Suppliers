import fs from "fs";
import path from "path";

/**
 * Image utility functions for handling inventory product images
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "inventory");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Ensure upload directory exists
 */
export function ensureUploadDir() {
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    return { valid: true };
}

/**
 * Generate unique filename with timestamp
 */
export function generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

    return `${sanitizedName}-${timestamp}-${randomString}${extension}`;
}

/**
 * Save uploaded file to disk
 */
export async function saveFile(file: File): Promise<string> {
    ensureUploadDir();

    const fileName = generateFileName(file.name);
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Return the public URL path
    return `/uploads/inventory/${fileName}`;
}

/**
 * Delete image file from disk
 */
export function deleteFile(imageUrl: string): boolean {
    try {
        // Extract filename from URL (e.g., /uploads/inventory/filename.jpg)
        const fileName = imageUrl.split("/").pop();
        if (!fileName) return false;

        const filePath = path.join(UPLOAD_DIR, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
}

/**
 * Delete multiple image files
 */
export function deleteFiles(imageUrls: string[]): void {
    imageUrls.forEach((url) => deleteFile(url));
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
