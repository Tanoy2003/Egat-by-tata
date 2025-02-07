import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { defineEventHandler, readMultipartFormData } from "h3";
import fs from "fs";

const prisma = new PrismaClient();

// ตั้งค่า AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "GET") {
    return await prisma.curu.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (method === "PUT") {
    try {
      const formData = await readMultipartFormData(event);
      if (!formData) throw new Error("No form data received");

      const curuId = parseInt(
        formData.find((item) => item.name === "id")?.data.toString() || "0"
      );
      const existingcuru = await prisma.curu.findUnique({
        where: { id: curuId },
      });
      if (!existingcuru) throw new Error("ไม่พบข้อมูลที่ต้องการแก้ไข");

      let newImageUrl = existingcuru.imageUrl;
      const imageFile = formData.find((item) => item.name === "image");

      if (imageFile && imageFile.filename) {
        if (existingcuru.imageUrl) {
          const oldKey = existingcuru.imageUrl.split(".com/")[1];
          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: oldKey,
              })
            );
          } catch (error) {
            console.error("Error deleting old file from S3:", error);
          }
        }

        const fileExt = imageFile.filename.split(".").pop();
        const uniqueFilename = `curu/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uniqueFilename,
            Body: imageFile.data,
            ContentType: imageFile.type,
          })
        );

        newImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;
      }

      const fields = [
        "number",
        "name",
        "brand",
        "curunumber",
        "partnumber",
        "usenumber",
        "date",
        "detial",
        "detialnumber",
      ];
      const data: Record<string, any> = {};
      fields.forEach((field) => {
        const item = formData.find((entry) => entry.name === field);
        data[field] = item ? item.data.toString() : existingcuru[field];
      });

      const updatedcuru = await prisma.curu.update({
        where: { id: curuId },
        data: {
          number: data.number ? parseInt(data.number) : existingcuru.number,
          name: data.name,
          brand: data.brand,
          curunumber: data.curunumber,
          partnumber: data.partnumber,
          usenumber: data.usenumber,
          date: data.date ? new Date(data.date) : existingcuru.date,
          detial: data.detial,
          detialnumber: data.detialnumber,
          imageUrl: newImageUrl,
        },
      });

      return {
        status: "success",
        message: "อัปเดตข้อมูลสำเร็จ",
        data: updatedcuru,
      };
    } catch (error) {
      return {
        status: "error",
        message: `เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ${(error as Error).message}`,
      };
    }
  }
});
//api/admin/crument/curu/curu.ts
