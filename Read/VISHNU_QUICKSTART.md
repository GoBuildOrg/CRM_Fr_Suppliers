# Vishnu RAG - Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js and npm installed
- [ ] OpenAI API key
- [ ] ChromaDB server running

## Step 1: Start ChromaDB Server

Choose one option:

### Option A: Docker (Easiest)
```bash
docker run -p 8000:8000 chromadb/chroma
```

### Option B: Python
```bash
pip install chromadb
chroma run --path ./chroma_data
```

## Step 2: Configure Environment

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=sk-your-key-here
```

## Step 3: Install Dependencies (Already Done)
```bash
npm install chromadb openai langchain pdf-parse xlsx
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Access Vishnu

Navigate to: http://localhost:3000/vishnu

## Test It!

1. Upload a test document (TXT, PDF, or Excel)
2. Wait for processing to complete
3. Ask a question about your document
4. See AI-powered responses with citations!

## Troubleshooting

### "Cannot connect to ChromaDB"
→ Make sure ChromaDB is running on port 8000

### "OpenAI API error"
→ Check your API key in `.env.local`

### "Upload failed"
→ Check that `/uploads` directory can be created

## 📚 Full Documentation

See [VISHNU_AGENTIC_ROADMAP.md](./VISHNU_AGENTIC_ROADMAP.md) for complete implementation details.
