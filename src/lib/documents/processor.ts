"use server";





export async function extractText(filePath: string, fileType: string) {
    console.log("[Processor] Extracting:", fileType);

    if (fileType.toLowerCase() === "pdf") {
        // Use pdf-text-extract which requires pdftotext installed on the system
        const extract = require("pdf-text-extract");

        return new Promise((resolve, reject) => {
            extract(filePath, (err: Error | null, pages: string[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(pages.join("\n"));
            });
        });
    }

    throw new Error("Unsupported file type");
}
