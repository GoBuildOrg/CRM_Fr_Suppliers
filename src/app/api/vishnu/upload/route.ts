export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { extractText } from '@/lib/documents/processor';
import { chunkText } from '@/lib/documents/chunker';
import { upsertDocuments, NAMESPACES } from '@/lib/vectordb/pinecone-client';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        console.log('========================================');
        console.log('[Vishnu Upload] 🚀 STEP 1: Starting upload request...');
        console.log('[Vishnu Upload] Timestamp:', new Date().toISOString());

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('[Vishnu Upload] ❌ STEP 1 FAILED: No file provided');
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('[Vishnu Upload] ✅ STEP 1 COMPLETE: File received');
        console.log('[Vishnu Upload] File name:', file.name);
        console.log('[Vishnu Upload] File size:', file.size, 'bytes');
        console.log('[Vishnu Upload] File type:', file.type);

        // Check environment variables
        console.log('[Vishnu Upload] 🔍 STEP 2: Checking environment variables...');
        console.log('[Vishnu Upload] PINECONE_API_KEY exists:', !!process.env.PINECONE_API_KEY);
        console.log('[Vishnu Upload] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

        if (!process.env.PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY is not set in environment variables');
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }

        console.log('[Vishnu Upload] ✅ STEP 2 COMPLETE: Environment variables validated');

        console.log('[Vishnu Upload] 💾 STEP 3: Saving file to disk...');
        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = join(process.cwd(), 'uploads');

        console.log('[Vishnu Upload] Upload directory:', uploadDir);
        console.log('[Vishnu Upload] Directory exists:', existsSync(uploadDir));

        // Create uploads directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            console.log('[Vishnu Upload] Creating uploads directory...');
            await mkdir(uploadDir, { recursive: true });
            console.log('[Vishnu Upload] ✅ Directory created');
        }

        const filePath = join(uploadDir, file.name);
        console.log('[Vishnu Upload] Saving to:', filePath);
        await writeFile(filePath, buffer);
        console.log('[Vishnu Upload] ✅ STEP 3 COMPLETE: File saved successfully');

        console.log('[Vishnu Upload] 📄 STEP 4: Extracting text from file...');
        // Extract text
        const fileType = file.name.split('.').pop() || '';
        console.log('[Vishnu Upload] File extension:', fileType);

        let text: string;
        try {
            text = await extractText(filePath, fileType);
            console.log('[Vishnu Upload] ✅ STEP 4 COMPLETE: Text extracted');
            console.log('[Vishnu Upload] Text length:', text.length, 'characters');
            console.log('[Vishnu Upload] Text preview (first 200 chars):', text.substring(0, 200));
        } catch (extractError) {
            console.error('[Vishnu Upload] ❌ STEP 4 FAILED: Text extraction error');
            console.error('[Vishnu Upload] Extract error:', extractError);
            throw extractError;
        }

        console.log('[Vishnu Upload] ✂️ STEP 5: Chunking text...');
        // Chunk text
        const documentId = `doc_${Date.now()}`;
        console.log('[Vishnu Upload] Document ID:', documentId);

        let chunks;
        try {
            chunks = chunkText(text, documentId);
            console.log('[Vishnu Upload] ✅ STEP 5 COMPLETE: Text chunked');
            console.log('[Vishnu Upload] Number of chunks:', chunks.length);
            console.log('[Vishnu Upload] Average chunk size:', Math.round(text.length / chunks.length), 'characters');
        } catch (chunkError) {
            console.error('[Vishnu Upload] ❌ STEP 5 FAILED: Chunking error');
            console.error('[Vishnu Upload] Chunk error:', chunkError);
            throw chunkError;
        }

        console.log('[Vishnu Upload] 📦 STEP 6: Preparing documents for Pinecone...');
        // Prepare documents for Pinecone
        const documents = chunks.map((chunk, idx) => {
            console.log(`[Vishnu Upload] Preparing chunk ${idx + 1}/${chunks.length}`);
            return {
                id: `${documentId}_chunk_${idx}`,
                text: chunk.text,
                metadata: {
                    documentId: chunk.metadata.documentId,
                    fileName: file.name,
                    chunkIndex: idx,
                    totalChunks: chunks.length,
                    uploadedAt: new Date().toISOString(),
                },
            };
        });

        console.log('[Vishnu Upload] ✅ STEP 6 COMPLETE: Documents prepared');
        console.log('[Vishnu Upload] Total documents to upsert:', documents.length);

        // Use default namespace for now (can be changed to user-specific later)
        // For multi-user support, you would use: NAMESPACES.getUserNamespace(userId)
        const namespace = 'uploaded_documents';

        console.log('[Vishnu Upload] 📤 STEP 7: Upserting to Pinecone...');
        console.log('[Vishnu Upload] Target namespace:', namespace);
        console.log('[Vishnu Upload] This may take a while for large documents...');

        try {
            await upsertDocuments(namespace, documents);
            console.log('[Vishnu Upload] ✅ STEP 7 COMPLETE: Upload to Pinecone successful');
        } catch (upsertError) {
            console.error('[Vishnu Upload] ❌ STEP 7 FAILED: Pinecone upsert error');
            console.error('[Vishnu Upload] Upsert error:', upsertError);
            throw upsertError;
        }

        console.log('[Vishnu Upload] 🎉 SUCCESS: Upload completed successfully');
        console.log('[Vishnu Upload] ========================================');

        return NextResponse.json({
            success: true,
            documentId,
            chunksProcessed: chunks.length,
            fileName: file.name,
        });
    } catch (error) {
        console.log('========================================');
        console.error('[Vishnu Upload] ❌❌❌ ERROR OCCURRED ❌❌❌');
        console.error('[Vishnu Upload] Error timestamp:', new Date().toISOString());
        console.error('[Vishnu Upload] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[Vishnu Upload] Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('[Vishnu Upload] Error stack trace:');
        console.error(error instanceof Error ? error.stack : 'No stack trace available');

        // Additional error context
        if (error instanceof Error) {
            console.error('[Vishnu Upload] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }

        console.log('[Vishnu Upload] ========================================');

        // Provide helpful error messages
        let errorMessage = 'Upload failed';
        let details = error instanceof Error ? error.message : 'Unknown error';

        if (details.includes('PINECONE_API_KEY')) {
            errorMessage = 'Pinecone API key not configured';
            details = 'Please add PINECONE_API_KEY to your .env.local file';
        } else if (details.includes('OPENAI_API_KEY')) {
            errorMessage = 'OpenAI API key not configured';
            details = 'Please add OPENAI_API_KEY to your .env.local file';
        } else if (details.includes('index') || details.includes('Index')) {
            errorMessage = 'Pinecone index not found';
            details = 'Please create the Pinecone index using: pc index create -n gobuild-crm-rag -m cosine -c serverless -r us-east-1 --dimension 1536';
        }

        return NextResponse.json({
            error: errorMessage,
            details
        }, { status: 500 });
    }
}
