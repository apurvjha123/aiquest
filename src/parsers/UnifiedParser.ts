import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import pdf from 'pdf-parse';
import { IParse } from './IParse';

export class UnifiedParser implements IParse {

    async parse(input: string | Buffer): Promise<string> {
        if (Buffer.isBuffer(input)) {
            if (input.slice(0, 4).toString() === "%PDF") {
                const pdfContent = await pdf(input);
                return pdfContent.text;
            } else {
                return input.toString('utf-8');
            }
        } else if (typeof input === 'string') {
            if (input.startsWith('http://') || input.startsWith('https://')) {
                const response = await axios.get(input);
                const $ = cheerio.load(response.data);
                return $.text();
            } else {
                // Determine parser from file extension
                const extension = path.extname(input).toLowerCase();
                switch (extension) {
                    case '.txt':
                        return fs.readFileSync(input, 'utf-8');
                    case '.pdf':
                        const absolutePath = path.resolve(input);
                        const pdfData = fs.readFileSync(absolutePath);
                        const pdfContent = await pdf(pdfData);
                        return pdfContent.text;
                    default:
                        throw new Error('Unsupported file type');
                }
            }
        } else {
            throw new Error('Unsupported input type for UnifiedParser');
        }
    }
}

