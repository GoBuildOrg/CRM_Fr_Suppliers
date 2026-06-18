import { NextRequest, NextResponse } from 'next/server';
import { queryMultipleNamespaces, NAMESPACES, initializeConstructionKnowledge } from '@/lib/vectordb/pinecone-client';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        console.log('========================================');
        console.log('[HealthGuide Query] 🚀 STEP 1: Starting query request...');
        console.log('[HealthGuide Query] Timestamp:', new Date().toISOString());

        const { query } = await request.json();
        console.log("The query for which openAI is called is : ",query);

        if (!query) {
            console.log('[HealthGuide Query] ❌ STEP 1 FAILED: No query provided');
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }

        console.log('[HealthGuide Query] ✅ STEP 1 COMPLETE: Query received');
        console.log('[HealthGuide Query] Query text:', query);
        console.log('[HealthGuide Query] Query length:', query.length);

        // Check environment variables
        console.log('[HealthGuide Query] 🔍 STEP 2: Checking environment variables...');
        console.log('[HealthGuide Query] PINECONE_API_KEY exists:', !!process.env.PINECONE_API_KEY);
        console.log('[HealthGuide Query] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
        console.log('[HealthGuide Query] PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME || 'default');

        if (!process.env.PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY is not set in environment variables');
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }

        console.log('[HealthGuide Query] ✅ STEP 2 COMPLETE: Environment variables validated');

        // Initialize health knowledge if not already done
        console.log('[HealthGuide Query] 📚 STEP 3: Initializing health knowledge...');
        try {
            await initializeConstructionKnowledge();
            console.log('[HealthGuide Query] ✅ STEP 3 COMPLETE: Health knowledge initialized or already exists');
        } catch (initError) {
            console.warn('[HealthGuide Query] ⚠️ STEP 3 WARNING: Could not initialize health knowledge');
            console.warn('[HealthGuide Query] Init error details:', initError);
            // Continue anyway - we might still have uploaded documents
        }

        // Query both health knowledge and uploaded documents
        console.log('[HealthGuide Query] 🔍 STEP 4: Preparing to query vector database...');
        const namespaces = [
            NAMESPACES.DEFAULT,        // Health industry knowledge
            'uploaded_documents',       // User uploaded documents
        ];

        console.log('[HealthGuide Query] Namespaces to query:', namespaces);

        console.log('[HealthGuide Query] 📊 STEP 5: Executing vector search...');
        const searchResults = await queryMultipleNamespaces(namespaces, query, 3);

        console.log('[HealthGuide Query] ✅ STEP 5 COMPLETE: Vector search finished');
        console.log('[HealthGuide Query] Total results found:', searchResults.length);
        console.log('[HealthGuide Query] Result details:', searchResults.map(r => ({
            id: r.id,
            score: r.score,
            hasMetadata: !!r.metadata,
            hasText: !!r.text,
            textLength: r.text?.length || 0
        })));

        // Check if we have any results
        if (!searchResults || searchResults.length === 0) {
            console.log('[HealthGuide Query] ⚠️ No results found - returning default message');
            return NextResponse.json({
                response: "I don't have enough information to answer that specific question. You can upload health documents for me to analyze, or ask me about general health and wellness topics, nutrition, fitness, mental health, or women's health. Remember to consult with a healthcare professional for medical concerns.",
                sources: [],
            });
        }

        console.log('[HealthGuide Query] 📝 STEP 6: Building context from results...');
        // Build context from results - only use uploaded documents, filter out construction knowledge
        const uploadedDocsContext = searchResults
            .filter(r => r.metadata?.fileName)
            .map(r => r.text)
            .join('\n\n');

        let context = '';
        if (uploadedDocsContext) {
            context += '=== Uploaded Health Documents ===\n' + uploadedDocsContext;
        } else {
            context = 'No specific documents uploaded. Providing general health guidance based on medical knowledge.';
        }

        console.log('[HealthGuide Query] ✅ STEP 6 COMPLETE: Context built');
        console.log('[HealthGuide Query] Uploaded docs context length:', uploadedDocsContext.length);
        console.log('[HealthGuide Query] Total context length:', context.length);
        console.log('[HealthGuide Query] Context preview (first 200 chars):', context.substring(0, 200));

        console.log('[HealthGuide Query] 🤖 STEP 7: Calling OpenAI API...');

        // Enhanced system prompt for health context
        const systemPrompt = `You are HealthGuide AI, an intelligent personal health advisor and medical expert. 

Your expertise includes:
- General health and wellness advice
- Fitness and exercise guidance  
- Mental health and stress management
- Nutrition, diet, and healthy eating
- Common health conditions and symptoms
- Medication information and side effects
- Preventive healthcare and wellness
- Women's health, pregnancy, and reproductive health
- First aid and emergency preparedness
- Sleep hygiene and sleep disorders

When answering questions:
1. Use the provided context to give accurate, specific health advice
2. If the context includes both health knowledge and uploaded documents, integrate both sources
3. Cite your sources when referencing specific information
4. For health questions without specific context, draw from general medical knowledge
5. Be empathetic, professional, and health-aware
6. Always emphasize consulting with qualified healthcare professionals for diagnosis and treatment
7. If you're not sure, say so rather than making up information
8. Do NOT provide specific medical diagnoses - suggest seeing a healthcare provider
9. Provide practical, actionable health advice and recommendations

IMPORTANT: This is for educational purposes only. Always encourage consultation with qualified healthcare professionals for medical concerns, diagnoses, and treatment decisions.`;

        // Generate response with LLM
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `Context:\n${context}\n\nQuestion: ${query}`,
                },
            ],
            temperature: 0.7,
        });

        console.log('[HealthGuide Query] ✅ STEP 7 COMPLETE: OpenAI response received');
        console.log('[HealthGuide Query] Response length:', completion.choices[0].message.content?.length || 0);

        const response = completion.choices[0].message.content;

        console.log('[HealthGuide Query] 📋 STEP 8: Extracting and processing sources...');
        // Extract sources with better metadata - only include uploaded documents
        const sources = searchResults
            .map((result) => {
                if (result.metadata?.fileName) {
                    // Uploaded document
                    return {
                        type: 'document' as const,
                        fileName: result.metadata.fileName as string,
                        chunkIndex: result.metadata.chunkIndex as number,
                        score: result.score,
                    };
                }
                // Filter out construction knowledge base - only use user uploaded documents
                return null;
            })
            .filter((s): s is NonNullable<typeof s> => s !== null);

        // Only document sources (no knowledge sources)
        const documentSources = sources.filter(s => s.type === 'document');

        console.log('[HealthGuide Query] ✅ STEP 8 COMPLETE: Sources extracted');
        console.log('[HealthGuide Query] Document sources:', documentSources.length);

        console.log('[HealthGuide Query] 🎉 SUCCESS: Returning response to client');
        console.log('[HealthGuide Query] ========================================');

        return NextResponse.json({
            response,
            sources: {
                documents: documentSources,
                knowledge: [],
            },
            resultsCount: searchResults.length,
        });
    } catch (error) {
        console.log('========================================');
        console.error('[HealthGuide Query] ❌❌❌ ERROR OCCURRED ❌❌❌');
        console.error('[HealthGuide Query] Error timestamp:', new Date().toISOString());
        console.error('[HealthGuide Query] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[HealthGuide Query] Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('[HealthGuide Query] Error stack trace:');
        console.error(error instanceof Error ? error.stack : 'No stack trace available');

        // Additional error context
        if (error instanceof Error) {
            console.error('[HealthGuide Query] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }

        console.log('[HealthGuide Query] ========================================');

        // Provide helpful error messages
        let errorMessage = 'Query failed';
        let details = error instanceof Error ? error.message : 'Unknown error';

        if (details.includes('PINECONE_API_KEY')) {
            errorMessage = 'Pinecone API key not configured';
            details = 'Please add PINECONE_API_KEY to your .env.local file';
        } else if (details.includes('OPENAI_API_KEY')) {
            errorMessage = 'OpenAI API key not configured';
            details = 'Please add OPENAI_API_KEY to your .env.local file';
        } else if (details.includes('index') || details.includes('Index')) {
            errorMessage = 'Pinecone index not found';
            details = 'Please ensure your Pinecone index is properly configured';
        }

        return NextResponse.json({
            error: errorMessage,
            details
        }, { status: 500 });
    }
}
