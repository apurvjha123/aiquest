import { UnifiedParser } from './UnifiedParser';
import fs from 'fs';
import axios from 'axios';
import pdf, { Result, Version } from 'pdf-parse';

jest.mock('fs');
jest.mock('axios');
jest.mock('pdf-parse');

describe('UnifiedParser', () => {
    let parser: UnifiedParser;

    beforeEach(() => {
        parser = new UnifiedParser();
    });

    describe('parse method', () => {
        it('should parse pdf buffer', async () => {
            const mockBuffer = Buffer.from('%PDF-sample-content');
            const mockPdfContent: Result = {
                text: 'parsed pdf content',
                numpages: 1,
                numrender: 1,
                info: {},
                metadata: {},
                version: '1.0' as Version
            };
            

            (pdf as jest.MockedFunction<typeof pdf>).mockResolvedValue(mockPdfContent);

            const result = await parser.parse(mockBuffer);
            expect(result).toBe(mockPdfContent.text);
        });

        it('should parse string buffer', async () => {
            const mockBuffer = Buffer.from('sample content');
            const result = await parser.parse(mockBuffer);
            expect(result).toBe('sample content');
        });

        it('should parse urls', async () => {
            const url = 'http://example.com';
            const mockHtml = '<div>Hello world</div>';
            (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockHtml });

            const result = await parser.parse(url);
            expect(result).toBe('Hello world');
        });

        it('should parse txt files', async () => {
            const mockFileContent = 'sample file content';
            (fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>).mockReturnValue(mockFileContent);

            const result = await parser.parse('sample.txt');
            expect(result).toBe(mockFileContent);
        });

        it('should throw error for unsupported input type', async () => {
            await expect(parser.parse(({} as unknown) as string)).rejects.toThrow('Unsupported input type for UnifiedParser');
        });
    });
});
