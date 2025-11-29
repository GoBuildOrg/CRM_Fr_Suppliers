import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
    console.log("the embeddings for this is generated : ", text);
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    console.log("This is the embeddings generated: ",response.data[0].embedding);
    return response.data[0].embedding;
}
