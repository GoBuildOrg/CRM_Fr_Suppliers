# Testing Vishnu RAG - Step by Step

## ✅ Prerequisites Checklist

Before testing, ensure:
- [x] ChromaDB server is running (`docker run -p 8000:8000 chromadb/chroma`)
- [x] OpenAI API key is set in `.env.local`
- [x] Dev server is running (`npm run dev`)

## 🧪 Test Workflow

### Test 1: Upload a Document

1. Navigate to http://localhost:3000/vishnu
2. Upload a sample document (TXT, PDF, or Excel)
3. Watch the progress bar fill up
4. Status should change: **Uploading** → **Processing** → **Ready** (green checkmark)

**What's happening behind the scenes:**
- File is sent to `/api/vishnu/upload`
- Text is extracted from the document
- Text is chunked into 1000-character pieces
- Each chunk is embedded using OpenAI Ada-002
- Embeddings are stored in ChromaDB

**Expected Browser Console Output:**
```
Upload successful: { success: true, documentId: "doc_...", chunksProcessed: 15 }
```

### Test 2: Ask Questions

1. After upload completes, type a question in the chat
2. Press Enter or click Send
3. Watch the typing indicator (bouncing dots)
4. Receive AI response with source citations

**Example Questions:**
- "What is this document about?"
- "Summarize the main points"
- "Extract all important dates"
- "What are the key findings?"

**What's happening behind the scenes:**
- Query is embedded using OpenAI Ada-002
- ChromaDB searches for the 5 most similar chunks
- Retrieved chunks are sent to GPT-4 as context
- GPT-4 generates a response based on the context
- Sources (filenames) are returned with the response

**Expected Response Format:**
```json
{
  "response": "Based on the documents...",
  "sources": [
    { "fileName": "your-file.pdf", "chunkIndex": 2, "distance": 0.23 }
  ]
}
```

## 🐛 Troubleshooting with Browser DevTools

### Open Browser Console
- Chrome/Edge: Press `F12` or `Ctrl+Shift+I`
- Look for the "Console" tab

### Common Issues & Solutions

#### Issue: "Cannot connect to ChromaDB"
**Console Error**: `fetch failed` or `ECONNREFUSED`
**Solution**: Make sure ChromaDB is running:
```bash
docker run -p 8000:8000 chromadb/chroma
```

#### Issue: "OpenAI API error"
**Console Error**: `401 Unauthorized` or `API key missing`
**Solution**: Check `.env.local` has:
```env
OPENAI_API_KEY=sk-your-actual-key
```

#### Issue: Upload shows "Failed"
**Console Error**: Check the upload error
**Common Causes**:
- File type not supported (only TXT, PDF, XLSX, XLS, CSV)
- File too large
- ChromaDB not running
- OpenAI API key issue

#### Issue: Query returns placeholder text
**Solution**: This has been fixed! Make sure you're running the latest code.

## 📊 Monitoring in Real-Time

### Check ChromaDB Collections
```bash
# In a separate terminal
curl http://localhost:8000/api/v1/collections
```

**Expected Output:**
```json
[
  {
    "name": "vishnu-documents",
    "metadata": { "hnsw:space": "cosine" }
  }
]
```

### Check Document Count
```bash
curl http://localhost:8000/api/v1/collections/vishnu-documents
```

This shows how many vectors (chunks) are stored.

## 🎯 Sample Test Files

Create these test files to verify functionality:

### test-document.txt
```
This is a test document for Vishnu RAG system.

Key Points:
1. RAG combines retrieval with generation
2. ChromaDB is an open-source vector database
3. OpenAI provides embeddings and completion

Important Date: November 25, 2024
Project Status: Complete and Functional
```

### test-data.csv
```
Product,Price,Quantity,Total
Laptop,1200,5,6000
Mouse,25,50,1250
Keyboard,75,30,2250
```

## ✅ Success Criteria

Your system is working correctly if:
- [x] Files upload without errors
- [x] Upload status shows green checkmark
- [x] Questions return relevant answers (not placeholder text)
- [x] Source citations appear below responses
- [x] Console shows no errors

## 📈 Performance Benchmarks

**Expected Response Times:**
- File upload: 2-10 seconds (depending on size)
- Embedding generation: 0.5-2 seconds per chunk
- Query processing: 2-5 seconds total
  - Embedding: ~0.5s
  - ChromaDB search: ~0.1s
  - GPT-4 response: 2-4s

## 🎉 Advanced Testing

Once basic functionality works:

1. **Multi-document queries**: Upload 2-3 files, ask questions that span them
2. **Complex questions**: Ask for comparisons, summaries, or data extraction
3. **Source verification**: Check that cited sources are accurate
4. **Error recovery**: Try uploading unsupported files, check error handling

---

**Happy Testing! 🚀**

If everything works, you now have a fully functional RAG system!
