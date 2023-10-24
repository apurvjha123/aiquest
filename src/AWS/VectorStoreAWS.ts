// index.ts

import aws from "aws-sdk";

interface EmbeddingEntry {
  content: string;
  embedding: number[];
}

export class VectorStoreAWS {
  private s3Bucket: aws.S3;
  private bucketName: string;
  
  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string
  ) {
    this.bucketName = bucketName;

    aws.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    this.s3Bucket = new aws.S3();
  }

  public async uploadEmbededModeltoAWS(
    embeddingStore: {
      content: string;
      embedding: number[];
    }[],
    fileName: string
  ): Promise<{ embededFileLocation: string }> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `embeddingRAG/embeded-${fileName}.txt`,
      Body: JSON.stringify(embeddingStore),
    };

    return new Promise((resolve, reject) => {
      this.s3Bucket.putObject(uploadParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const embededFileLocation = `https://${this.bucketName}.s3.ap-south-1.amazonaws.com/embeddingRAG/embeded-${fileName}.txt`;
          resolve({ embededFileLocation: embededFileLocation });
        }
      });
    });
  }

  public getKnowledgeData(fileName: string) : Promise<EmbeddingEntry[]> {
    const params = {
      Bucket: this.bucketName,
      Key: `embeddingRAG/embeded-${fileName}.txt`,
    };
    return new Promise((resolve, reject) => {
      this.s3Bucket.getObject(params, (err, data) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
        } else if (data && data.Body) {
          resolve(JSON.parse(data.Body.toString("utf-8")));
        } else {
          reject(new Error("No data returned from S3 or data.Body is undefined."));
        }
      });      
    });
  }
}

