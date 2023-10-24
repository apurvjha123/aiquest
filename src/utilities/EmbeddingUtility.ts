import { OpenAI } from 'openai';

export class EmbeddingUtility {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({apiKey});
    }

    async createEmbedding(chunks: string[]): Promise<{ content: string, embedding: number[] }[]> {
        const response = await this.openai.embeddings.create({
            input: chunks,
            model: "text-embedding-ada-002"
        });
    
        const embeddings = response.data;
    
        // Check to ensure the length of embeddings matches the length of chunks
        if (embeddings.length !== chunks.length) {
            throw new Error('Embedding response length mismatch.');
        }
    
        const embeddingStore = chunks.map((chunk, index) => {
            if (!embeddings[index] || !embeddings[index]?.embedding) {
                throw new Error(`Embedding missing for chunk at index ${index}`);
            }
    
            return {
                content: chunk,
                embedding: embeddings[index]?.embedding as number[]
            };
        });
    
        return embeddingStore;
    }        
}

