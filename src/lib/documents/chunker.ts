export interface Chunk {
    text: string;
    metadata: {
        documentId: string;
        chunkIndex: number;
        totalChunks: number;
    };
}

export function chunkText(
    text: string,
    documentId: string,
    chunkSize: number = 1000,
    overlap: number = 200
): Chunk[] {
    const chunks: Chunk[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        const chunkText = text.slice(startIndex, endIndex);

        chunks.push({
            text: chunkText,
            metadata: {
                documentId,
                chunkIndex,
                totalChunks: 0, // Will be updated
            },
        });

        startIndex += chunkSize - overlap;
        chunkIndex++;
    }

    // Update total chunks
    chunks.forEach(chunk => {
        chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
}
