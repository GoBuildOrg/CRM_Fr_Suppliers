import { NextRequest, NextResponse } from 'next/server';
import { queryMultipleNamespaces, NAMESPACES, initializeConstructionKnowledge } from '@/lib/vectordb/pinecone-client';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        console.log('========================================');
        console.log('[Vishnu Query] 🚀 STEP 1: Starting query request...');
        console.log('[Vishnu Query] Timestamp:', new Date().toISOString());

        const { query } = await request.json();
        console.log("The query for which openAI is called is : ",query);

        if (!query) {
            console.log('[Vishnu Query] ❌ STEP 1 FAILED: No query provided');
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }

        console.log('[Vishnu Query] ✅ STEP 1 COMPLETE: Query received');
        console.log('[Vishnu Query] Query text:', query);
        console.log('[Vishnu Query] Query length:', query.length);

        // Check environment variables
        console.log('[Vishnu Query] 🔍 STEP 2: Checking environment variables...');
        console.log('[Vishnu Query] PINECONE_API_KEY exists:', !!process.env.PINECONE_API_KEY);
        console.log('[Vishnu Query] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
        console.log('[Vishnu Query] PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME || 'gobuild-crm-rag (default)');

        if (!process.env.PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY is not set in environment variables');
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }

        console.log('[Vishnu Query] ✅ STEP 2 COMPLETE: Environment variables validated');

        // Initialize construction knowledge if not already done
        console.log('[Vishnu Query] 📚 STEP 3: Initializing construction knowledge...');
        try {
            await initializeConstructionKnowledge();
            console.log('[Vishnu Query] ✅ STEP 3 COMPLETE: Construction knowledge initialized or already exists');
        } catch (initError) {
            console.warn('[Vishnu Query] ⚠️ STEP 3 WARNING: Could not initialize construction knowledge');
            console.warn('[Vishnu Query] Init error details:', initError);
            // Continue anyway - we might still have uploaded documents
        }

        // Query both construction knowledge and uploaded documents
        console.log('[Vishnu Query] 🔍 STEP 4: Preparing to query vector database...');
        const namespaces = [
            NAMESPACES.DEFAULT,        // Construction industry knowledge
            'uploaded_documents',       // User uploaded documents
        ];

        console.log('[Vishnu Query] Namespaces to query:', namespaces);

        console.log('[Vishnu Query] 📊 STEP 5: Executing vector search...');
        const searchResults = await queryMultipleNamespaces(namespaces, query, 3);

        console.log('[Vishnu Query] ✅ STEP 5 COMPLETE: Vector search finished');
        console.log('[Vishnu Query] Total results found:', searchResults.length);
        console.log('[Vishnu Query] Result details:', searchResults.map(r => ({
            id: r.id,
            score: r.score,
            hasMetadata: !!r.metadata,
            hasText: !!r.text,
            textLength: r.text?.length || 0
        })));

        // Check if we have any results
        if (!searchResults || searchResults.length === 0) {
            console.log('[Vishnu Query] ⚠️ No results found - returning default message');
            return NextResponse.json({
                response: "I don't have enough information to answer that question. You can upload documents for me to analyze, or ask me about construction CRM processes, supplier management, quotations, or project management.",
                sources: [],
            });
        }

        console.log('[Vishnu Query] 📝 STEP 6: Building context from results...');
        // Build context from results
        // Group by source for better attribution
        const constructionContext = searchResults
            .filter(r => r.metadata?.source === 'construction_knowledge_base')
            .map(r => r.text)
            .join('\n\n');

        const uploadedDocsContext = searchResults
            .filter(r => r.metadata?.fileName)
            .map(r => r.text)
            .join('\n\n');

        let context = '';
        if (constructionContext) {
            context += '=== Construction Industry Knowledge ===\n' + constructionContext + '\n\n';
        }
        if (uploadedDocsContext) {
            context += '=== Uploaded Documents ===\n' + uploadedDocsContext;
        }

        console.log('[Vishnu Query] ✅ STEP 6 COMPLETE: Context built');
        console.log('[Vishnu Query] Construction context length:', constructionContext.length);
        console.log('[Vishnu Query] Uploaded docs context length:', uploadedDocsContext.length);
        console.log('[Vishnu Query] Total context length:', context.length);
        console.log('[Vishnu Query] Context preview (first 200 chars):', context.substring(0, 200));

        console.log('[Vishnu Query] 🤖 STEP 7: Calling OpenAI API...');

        // Enhanced system prompt for construction context
        const systemPrompt = `You are Vishnu, an intelligent assistant specialized in construction industry CRM and business processes. 

Your expertise includes:
- Construction project management and workflows
- Supplier and subcontractor management
- Quotation and estimation processes
- Material tracking and inventory
- Order and payment management
- Quality control and compliance
- Construction industry best practices

When answering questions:
1. Use the provided context to give accurate, specific answers
2. If the context includes both construction knowledge and uploaded documents, integrate both sources
3. Cite your sources when referencing specific information
4. For construction-related questions without specific context, draw from general construction industry knowledge
5. Be helpful, professional, and construction-industry aware
6. If you're not sure, say so rather than making up information

Always provide practical, actionable advice relevant to construction CRM and business operations.`;

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

        console.log('[Vishnu Query] ✅ STEP 7 COMPLETE: OpenAI response received');
        console.log('[Vishnu Query] Response length:', completion.choices[0].message.content?.length || 0);

        const response = completion.choices[0].message.content;

        console.log('[Vishnu Query] 📋 STEP 8: Extracting and processing sources...');
        // Extract sources with better metadata
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
                } else if (result.metadata?.source === 'construction_knowledge_base') {
                    // Construction knowledge
                    return {
                        type: 'knowledge' as const,
                        category: result.metadata.category as string,
                        score: result.score,
                    };
                }
                return null;
            })
            .filter((s): s is NonNullable<typeof s> => s !== null);

        // Group sources by type for cleaner display
        const documentSources = sources.filter(s => s.type === 'document');
        const knowledgeSources = sources.filter(s => s.type === 'knowledge');

        console.log('[Vishnu Query] ✅ STEP 8 COMPLETE: Sources extracted');
        console.log('[Vishnu Query] Document sources:', documentSources.length);
        console.log('[Vishnu Query] Knowledge sources:', knowledgeSources.length);

        console.log('[Vishnu Query] 🎉 SUCCESS: Returning response to client');
        console.log('[Vishnu Query] ========================================');

        return NextResponse.json({
            response,
            sources: {
                documents: documentSources,
                knowledge: knowledgeSources,
            },
            resultsCount: searchResults.length,
        });
    } catch (error) {
        console.log('========================================');
        console.error('[Vishnu Query] ❌❌❌ ERROR OCCURRED ❌❌❌');
        console.error('[Vishnu Query] Error timestamp:', new Date().toISOString());
        console.error('[Vishnu Query] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[Vishnu Query] Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('[Vishnu Query] Error stack trace:');
        console.error(error instanceof Error ? error.stack : 'No stack trace available');

        // Additional error context
        if (error instanceof Error) {
            console.error('[Vishnu Query] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }

        console.log('[Vishnu Query] ========================================');

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
            details = 'Please create the Pinecone index using: pc index create -n gobuild-crm-rag -m cosine -c serverless -r us-east-1 --dimension 1536';
        }

        return NextResponse.json({
            error: errorMessage,
            details
        }, { status: 500 });
    }
}
