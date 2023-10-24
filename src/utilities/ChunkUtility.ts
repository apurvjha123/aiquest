export class ChunkUtility{

    static splitIntoChunks(text: string, numOfChunks: number, overlapSplitChunks: number): string[] {
        const words = text.split(/\s+/);
        const wordsPerChunk = Math.ceil(words.length / numOfChunks);
        
        const chunks = [];
        for (let i = 0; i < words.length; i += wordsPerChunk - overlapSplitChunks) {
            chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
        }
        return chunks;
    }
}