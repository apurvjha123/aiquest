import { OpenAI } from "openai";

interface EmbeddingEntry {
  content: string;
  embedding: number[];
}

interface ScoredParagraph {
  paragraph: string;
  score: number;
}

export class Retrival {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async QnARetrival(embeddingStore: EmbeddingEntry[], question: string) {
    const closestEntries = await this.semanticSearch(question, embeddingStore, 3);
    const closestParagraphs = closestEntries.map(entry => entry.content);

    let completionData = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "user",
          content: this.Prompt(question, closestParagraphs),
        },
      ],
      temperature: 0,
    });
    return completionData;
  }

  public async semanticSearch(query: string, embeddingStore: EmbeddingEntry[], topN: number = 5): Promise<EmbeddingEntry[]> {
    const response = await this.openai.embeddings.create({
      input: query,
      model: "text-embedding-ada-002",
    });
    const queryEmbedding = response.data && response.data[0] && response.data[0].embedding;
if (!queryEmbedding) {
    throw new Error("No embedding found in response data");
}

    return this.findNearestParagraph(embeddingStore, queryEmbedding, topN);
  }

  private findNearestParagraph(embeddingStore: EmbeddingEntry[], targetEmbedding: number[], count: number): EmbeddingEntry[] {
    const scoredEntries = embeddingStore.map(entry => ({
      entry,
      score: this.cosineSimilarity(targetEmbedding, entry.embedding)
    }));

    return scoredEntries.sort((a, b) => b.score - a.score).slice(0, count).map(item => item.entry);
  }

  private Prompt(question: string, paragraphs: string[]) {
    return (
      "You are AI Assistant, your are RAG ChatBot . Developed by Apurv Krishn Jha. Answer the following question from the context, if the answer cannot be deduced from the context, say 'Sorry! I didn't Understand the Question, Please explain it in detail':\n\n" +
      "Context :\n" +
      paragraphs.join("\n\n") +
      "\n\nQuestion :\n" +
      question +
      "?" +
      "\n\nAnswer :"
    );
  }

  private compareEmbeddings(embedding1: number[], embedding2: number[]): number {
    const length = Math.min(embedding1.length, embedding2.length);
    let dotprod = 0;

    for (let i = 0; i < length; i++) {
      dotprod += (embedding1[i] || 0) * (embedding2[i] || 0);
    }
    return dotprod;
  }
  private cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    const dotProduct = this.compareEmbeddings(embedding1 , embedding2)
    const magnitudeA = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
}
