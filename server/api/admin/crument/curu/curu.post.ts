import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defineEventHandler, readMultipartFormData } from "h3";

const prisma = new PrismaClient();

// ตั้งค่า AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) throw new Error("No form data received");

    // ดึงค่าจาก FormData
    const imageFile = formData.find((item) => item.name === "image");
    const number = formData
      .find((item) => item.name === "number")
      ?.data.toString();
    const name = formData.find((item) => item.name === "name")?.data.toString();
    const brand = formData
      .find((item) => item.name === "brand")
      ?.data.toString();
    const curunumber = formData
      .find((item) => item.name === "curunumber")
      ?.data.toString();
    const partnumber = formData
      .find((item) => item.name === "partnumber")
      ?.data.toString();
    const usenumber = formData
      .find((item) => item.name === "usenumber")
      ?.data.toString();
    const date = formData.find((item) => item.name === "date")?.data.toString();
    const detial = formData
      .find((item) => item.name === "detial")
      ?.data.toString();
    const detialnumber = formData
      .find((item) => item.name === "detialnumber")
      ?.data.toString();

    let imageUrl = null;

    // ✅ อัปโหลดไฟล์ไป AWS S3 (ถ้ามีการแนบไฟล์)
    if (imageFile && imageFile.filename) {
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

      // ✅ สร้าง URL ของไฟล์ที่อัปโหลด
      imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;
    }

    // ✅ บันทึกข้อมูลลงฐานข้อมูล
    const curu = await prisma.curu.create({
      data: {
        number: number ? parseInt(number) : null,
        name,
        brand,
        curunumber,
        partnumber,
        usenumber,
        date: date ? new Date(date) : null,
        detial,
        detialnumber,
        imageUrl, // ✅ เก็บ URL ของไฟล์ที่อัปโหลดใน S3
      },
    });

    return {
      status: "success",
      message: "บันทึกข้อมูลสำเร็จ",
      data: curu,
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      status: "error",
      message: `เกิดข้อผิดพลาด: ${error.message}`,
    };
  }
});
//api/admin/crument/curu/curu.post.ts
