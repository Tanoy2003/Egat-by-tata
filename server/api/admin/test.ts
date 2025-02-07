import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defineEventHandler, readMultipartFormData } from "h3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export default defineEventHandler(async (event) => {
  if (event.req.method === "POST") {
    try {
      const formData = await readMultipartFormData(event);
      if (!formData) throw new Error("No form data received");

      const imageFile = formData.find((item) => item.name === "image");
      if (!imageFile || !imageFile.filename)
        throw new Error("No image file received");

      const fileExt = imageFile.filename.split(".").pop();
      const uniqueFilename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `test-uploads/${uniqueFilename}`,
          Body: imageFile.data,
          ContentType: imageFile.type,
        })
      );

      const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/test-uploads/${uniqueFilename}`;

      return {
        status: "success",
        message: "File uploaded successfully",
        imageUrl,
      };
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  return { status: "error", message: "Method not allowed" };
});
