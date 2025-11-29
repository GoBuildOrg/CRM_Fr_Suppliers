import { Pinecone } from '@pinecone-database/pinecone';
import { getConstructionKnowledge } from '@/lib/knowledge/construction-knowledge';
import { generateEmbedding } from '@/lib/embeddings/openai-embeddings';

// Initialize Pinecone client
let pineconeClient: Pinecone | null = null;

/**
 * Get or create Pinecone client instance (singleton pattern)
 */
export function getPineconeClient(): Pinecone {
    console.log('[Pinecone Client] 🔌 Initializing Pinecone client...');

    if (!pineconeClient) {
        const apiKey = process.env.PINECONE_API_KEY;

        console.log('[Pinecone Client] API key exists:', !!apiKey);
        console.log('[Pinecone Client] API key length:', apiKey?.length || 0);

        if (!apiKey) {
            console.error('[Pinecone Client] ❌ PINECONE_API_KEY not found in environment');
            throw new Error(
                'PINECONE_API_KEY environment variable is not set. ' +
                'Please add it to your .env.local file.'
            );
        }

        console.log('[Pinecone Client] Creating new Pinecone instance...');
        try {
            pineconeClient = new Pinecone({
                apiKey,
            });
            console.log('[Pinecone Client] ✅ Client initialized successfully');
        } catch (error) {
            console.error('[Pinecone Client] ❌ Failed to initialize client:', error);
            throw error;
        }
    } else {
        console.log('[Pinecone Client] ✅ Using existing client instance');
    }

    return pineconeClient;
}

/**
 * Get Pinecone index instance
 */
export function getPineconeIndex() {
    console.log('[Pinecone Index] 📊 Getting index instance...');

    const client = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME || 'gobuild-crm-rag';

    console.log('[Pinecone Index] Index name:', indexName);
    console.log('[Pinecone Index] Index name source:', process.env.PINECONE_INDEX_NAME ? 'environment variable' : 'default');
    console.log('[Pinecone Index] ✅ Index instance created');

    return client.index(indexName);
}

/**
 * Namespace strategy for multi-tenant support
 */
export const NAMESPACES = {
    DEFAULT: 'default', // For construction knowledge base
    getUserNamespace: (userId: string) => `user_${userId}`,
    getSessionNamespace: (sessionId: string) => `session_${sessionId}`,
} as const;

interface UpsertDocument {
    id: string;
    text: string;
    metadata?: Record<string, string | number | boolean | string[]>;
}

/**
 * Upsert documents to Pinecone
 * @param namespace - The namespace to store documents in
 * @param documents - Array of documents to upsert
 */
export async function upsertDocuments(
    namespace: string,
    documents: UpsertDocument[]
): Promise<void> {
    const index = getPineconeIndex();

    console.log(`[Pinecone] Upserting ${documents.length} documents to namespace: ${namespace}`);

    // Process documents in batches (Pinecone recommends 100 vectors per batch)
    const BATCH_SIZE = 96; // Using text-based limit for consistency

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
        const batch = documents.slice(i, i + BATCH_SIZE);

        // Generate embeddings and prepare vectors
        const vectors = await Promise.all(
            batch.map(async (doc) => {
                const embedding = await generateEmbedding(doc.text);

                return {
                    id: doc.id,
                    values: embedding,
                    metadata: {
                        text: doc.text,
                        ...doc.metadata,
                    },
                };
            })
        );

        // Upsert to Pinecone
        await index.namespace(namespace).upsert(vectors);

        console.log(`[Pinecone] Upserted batch ${i / BATCH_SIZE + 1} (${vectors.length} vectors)`);
    }

    console.log('[Pinecone] Upsert completed successfully');
}

interface QueryResult {
    id: string;
    score: number;
    metadata?: Record<string, any>;
    text?: string;
}

/**
 * Query documents from Pinecone
 * @param namespace - The namespace to query from
 * @param queryText - The query text
 * @param topK - Number of results to return
 * @returns Array of matching documents with scores
 */
export async function queryDocuments(
    namespace: string,
    queryText: string,
    topK: number = 5
): Promise<QueryResult[]> {
    console.log('[Pinecone Query] 🔍 Starting query...');
    console.log('[Pinecone Query] Namespace:', namespace);
    console.log('[Pinecone Query] Query text length:', queryText.length);
    console.log('[Pinecone Query] Top K:', topK);

    const index = getPineconeIndex();

    console.log('[Pinecone Query] 🧮 Generating query embedding...');
    let queryEmbedding: number[];
    try {
        queryEmbedding = await generateEmbedding(queryText);
        console.log('[Pinecone Query] ✅ Embedding generated, dimension:', queryEmbedding.length);
    } catch (embeddingError) {
        console.error('[Pinecone Query] ❌ Failed to generate embedding:', embeddingError);
        throw embeddingError;
    }

    console.log('[Pinecone Query] 📡 Querying Pinecone index...');
    let queryResponse;
    try {
        queryResponse = await index.namespace(namespace).query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
        });
        console.log('[Pinecone Query] ✅ Query successful');
        console.log('[Pinecone Query] Matches found:', queryResponse.matches?.length || 0);
    } catch (queryError) {
        console.error('[Pinecone Query] ❌ Query failed:', queryError);
        throw queryError;
    }

    // Transform results
    const results: QueryResult[] = (queryResponse.matches || []).map((match, idx) => {
        console.log(`[Pinecone Query] Match ${idx + 1}: ID=${match.id}, Score=${match.score?.toFixed(4)}, HasMetadata=${!!match.metadata}`);
        return {
            id: match.id,
            score: match.score || 0,
            metadata: match.metadata as Record<string, any>,
            text: match.metadata?.text as string,
        };
    });

    console.log('[Pinecone Query] ✅ Returning', results.length, 'results');
    return results;
}

/**
 * Query multiple namespaces and merge results
 * Useful for querying both user documents and default knowledge
 */
export async function queryMultipleNamespaces(
    namespaces: string[],
    queryText: string,
    topKPerNamespace: number = 3
): Promise<QueryResult[]> {
    console.log('[Pinecone Multi-Query] 🔍 Querying multiple namespaces...');
    console.log('[Pinecone Multi-Query] Namespaces:', namespaces);
    console.log('[Pinecone Multi-Query] Query text:', queryText.substring(0, 100) + '...');
    console.log('[Pinecone Multi-Query] Top K per namespace:', topKPerNamespace);

    // Query all namespaces in parallel
    console.log('[Pinecone Multi-Query] 📡 Starting parallel queries for', namespaces.length, 'namespaces...');
    const results = await Promise.all(
        namespaces.map(async (ns, idx) => {
            console.log(`[Pinecone Multi-Query] Query ${idx + 1}/${namespaces.length}: ${ns}`);
            try {
                const nsResults = await queryDocuments(ns, queryText, topKPerNamespace);
                console.log(`[Pinecone Multi-Query] ✅ Namespace ${ns}: ${nsResults.length} results`);
                return nsResults;
            } catch (error) {
                console.error(`[Pinecone Multi-Query] ❌ Namespace ${ns} failed:`, error);
                return [];
            }
        })
    );

    // Flatten and sort by score
    const allResults = results.flat().sort((a, b) => b.score - a.score);

    console.log('[Pinecone Multi-Query] ✅ Combined', allResults.length, 'total results from all namespaces');
    console.log('[Pinecone Multi-Query] Top 3 scores:', allResults.slice(0, 3).map(r => r.score.toFixed(4)));

    return allResults;
}

/**
 * Get index statistics
 */
export async function getIndexStats() {
    console.log('[Pinecone Stats] 📊 Fetching index statistics...');
    const index = getPineconeIndex();
    const stats = await index.describeIndexStats();

    console.log('[Pinecone Stats] ✅ Stats retrieved');
    console.log('[Pinecone Stats] Total vectors:', stats.totalRecordCount);
    console.log('[Pinecone Stats] Namespaces:', Object.keys(stats.namespaces || {}));

    return stats;
}

/**
 * Initialize default construction knowledge base
 * This should be run once during setup or on first query if empty
 */
export async function initializeConstructionKnowledge(): Promise<void> {
    console.log('[Pinecone Init] 📚 Checking construction knowledge initialization...');

    try {
        // Check if default namespace already has data
        console.log('[Pinecone Init] 🔍 Checking if knowledge base exists...');
        const stats = await getIndexStats();
        const defaultNamespaceCount = stats.namespaces?.[NAMESPACES.DEFAULT]?.recordCount || 0;

        console.log('[Pinecone Init] Default namespace record count:', defaultNamespaceCount);

        if (defaultNamespaceCount > 0) {
            console.log(`[Pinecone Init] ✅ Construction knowledge already initialized (${defaultNamespaceCount} documents)`);
            return;
        }

        console.log('[Pinecone Init] ⚠️ No construction knowledge found, initializing...');
        // Get construction knowledge
        const knowledge = getConstructionKnowledge();
        console.log('[Pinecone Init] 📖 Loaded', knowledge.length, 'knowledge items');

        // Prepare documents for upsert
        const documents: UpsertDocument[] = knowledge.map((item) => ({
            id: item.id,
            text: item.content,
            metadata: {
                category: item.category,
                source: 'construction_knowledge_base',
            },
        }));

        console.log('[Pinecone Init] 💾 Upserting construction knowledge to Pinecone...');
        // Upsert to default namespace
        await upsertDocuments(NAMESPACES.DEFAULT, documents);

        console.log(`[Pinecone Init] ✅ Construction knowledge initialized with ${documents.length} documents`);
    } catch (error) {
        console.error('[Pinecone Init] ❌ Failed to initialize construction knowledge:');
        console.error('[Pinecone Init] Error details:', error);
        throw error;
    }
}

/**
 * Delete all vectors in a namespace
 * Use with caution - this is irreversible!
 */
export async function clearNamespace(namespace: string): Promise<void> {
    const index = getPineconeIndex();

    console.log(`[Pinecone] Clearing namespace: ${namespace}`);

    await index.namespace(namespace).deleteAll();

    console.log('[Pinecone] Namespace cleared successfully');
}
