export interface IParse {
    parse(input: string | Buffer): Promise<string>;
}