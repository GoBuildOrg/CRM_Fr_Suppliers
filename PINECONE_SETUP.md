# Pinecone RAG Setup Guide

This guide will help you set up the Pinecone-powered RAG system for the GoBuild Construction CRM.

## Prerequisites

- Node.js and npm installed
- Pinecone account with API key
- OpenAI account with API key

## Step 1: Configure Environment Variables

Add the following to your `.env.local` file (create it if it doesn't exist):

```bash
# Pinecone Vector Database
PINECONE_API_KEY="your-pinecone-api-key-here"
PINECONE_INDEX_NAME="gobuild-crm-rag"

# OpenAI (for embeddings and LLM)
OPENAI_API_KEY="your-openai-api-key-here"
```

**Where to get API keys:**
- **Pinecone**: Sign up at https://www.pinecone.io/ and create a new API key
- **OpenAI**: Sign up at https://platform.openai.com/ and create a new API key

## Step 2: Install Pinecone CLI

The CLI is needed to create and manage your Pinecone index.

**macOS (Homebrew):**
```bash
brew tap pinecone-io/tap
brew install pinecone-io/tap/pinecone
```

**Other platforms:**
Download from: https://github.com/pinecone-io/cli/releases

**Verify installation:**
```bash
pc version
```

## Step 3: Configure Pinecone CLI

Authenticate the CLI with your API key:

```bash
export PINECONE_API_KEY="your-pinecone-api-key"
pc auth configure --api-key $PINECONE_API_KEY
```

## Step 4: Create Pinecone Index

Create the index that will store your vectors:

```bash
pc index create -n gobuild-crm-rag -m cosine -c serverless -r us-east-1 --dimension 1536
```

**Important notes:**
- Index name: `gobuild-crm-rag` (must match `PINECONE_INDEX_NAME` in .env.local)
- Metric: `cosine` (recommended for semantic similarity)
- Cloud: `serverless` (cost-effective, auto-scaling)
- Region: `us-east-1` (choose based on your location)
- Dimension: `1536` (matches OpenAI's text-embedding-ada-002 model)

**Verify index creation:**
```bash
pc index list
pc index describe --index gobuild-crm-rag
```

## Step 5: Install Dependencies

From your project root:

```bash
cd /home/vk092/MyStartup/CRM/CRM_Fr_Suppliers
npm install
```

The Pinecone SDK (`@pinecone-database/pinecone`) is already in package.json.

## Step 6: Start the Development Server

```bash
npm run dev
```

The application should now be running at http://localhost:3000

## Step 7: Test the RAG System

### Test 1: Query Without Documents (Construction Knowledge)

1. Navigate to the Vishnu chat interface in your app
2. Try these queries:
   - "How do I manage suppliers in a construction CRM?"
   - "What's the typical quotation workflow?"
   - "Best practices for material tracking"

**Expected**: You should get detailed answers based on the built-in construction industry knowledge base.

### Test 2: Upload a Document

1. Upload a PDF or text file through the Vishnu interface
2. Check the browser console for upload logs
3. You should see: "Upload completed successfully"

### Test 3: Query Uploaded Documents

1. Ask questions about the content of your uploaded document
2. The response should reference both the uploaded document AND construction knowledge when relevant

## Verification

Check that everything is working:

```bash
# View index statistics
pc index describe-stats --index gobuild-crm-rag

# You should see:
# - Namespace "default" with ~20 vectors (construction knowledge)
# - Namespace "uploaded_documents" with vectors from your uploads
```

## Troubleshooting

### Error: "PINECONE_API_KEY environment variable is not set"
- Make sure you've added the API key to `.env.local`
- Restart the dev server after adding environment variables

### Error: "Pinecone index not found"
- Verify the index exists: `pc index list`
- Check that `PINECONE_INDEX_NAME` in `.env.local` matches your index name
- If needed, create the index using the command in Step 4

### Error: "OPENAI_API_KEY not configured"
- Add your OpenAI API key to `.env.local`
- Restart the dev server

### Slow first query
- The first query initializes the construction knowledge base (20 documents)
- This takes 10-30 seconds as it generates embeddings
- Subsequent queries will be fast

## Architecture Overview

The RAG system uses:

- **Pinecone**: Vector database for storing embeddings
- **OpenAI text-embedding-ada-002**: For generating embeddings (1536 dimensions)
- **OpenAI GPT-4**: For generating answers based on retrieved context
- **Multi-namespace architecture**:
  - `default`: Construction industry knowledge base (20 topics)
  - `uploaded_documents`: User-uploaded documents
- **Smart querying**: Queries both namespaces and merges results

## What's Included

The system comes pre-loaded with construction industry knowledge:

1. Supplier management
2. Quotation workflows
3. Project lifecycle management
4. Material tracking
5. Lead management
6. Order management
7. Customer communication
8. Compliance and safety
9. Cost estimation
10. Subcontractor management
11. Equipment management
12. Quality control
13. Document management
14. Payment and invoicing
15. Warranty management
16. Reporting and analytics
17. CRM features
18. Risk management
19. Stakeholder management
20. Project scheduling

This knowledge base ensures the system is useful even without uploaded documents!

## Next Steps

- Upload your construction company's documents (quotes, contracts, SOPs, etc.)
- The system will combine your documents with construction best practices
- Use it for:
  - Training new employees
  - Quick reference for processes
  - Document analysis and insights
  - Answering construction CRM questions

## Support

For issues:
- Pinecone docs: https://docs.pinecone.io/
- OpenAI docs: https://platform.openai.com/docs
- Check browser console for detailed error logs
