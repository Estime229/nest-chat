import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createId } from '@paralleldrive/cuid2';
import { fileSchema } from 'src/file-utils';
import z from 'zod';
import 'dotenv/config';
// Ensure that AWS credentials and region are set in environment variables
const AWS_ACCESS_KEY = process.env.AWS_ACCES_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET;
const AWS_REGION = process.env.AWS_REGION;
export class AwsS3Service {
  private readonly client: S3Client;
  constructor() {
    if (!AWS_ACCESS_KEY) {
      throw new Error('AWS_ACCESS_KEY is not defined');
    }

    if (!AWS_SECRET_KEY) {
      throw new Error('AWS_SECRET_KEY is not defined');
    }

    if (!AWS_REGION) {
      throw new Error('AWS_REGION is not defined');
    }

    const client = new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
      region: AWS_REGION,
    });
    this.client = client;
  }

  async uploadFile({ file }: { file: z.infer<typeof fileSchema> }) {
    const fileKey = createId() + file.originalname;
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'max-age=31536000',
    });
    const result = await this.client.send(putObjectCommand);

    if (result.$metadata.httpStatusCode !== 200) {
      console.error('Error uploading file to S3', result);
    }
    return { fileKey };
  }

  async deleteFile({ fileKey }: { fileKey: string }) {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });
    const result = await this.client.send(deleteObjectCommand);

    if (result.$metadata.httpStatusCode !== 200) {
      console.error('Error uploading file to S3', result);
    }
    return { fileKey };
  }
}
