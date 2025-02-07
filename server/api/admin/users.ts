import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    if (method === "GET") {
      return await prisma.user.findMany();
    }

    if (method === "PUT") {
      const body = await readBody(event);
      const { id, fullname, role } = body;

      if (!id || !role) {
        return sendError(
          event,
          new Error("ต้องระบุ id และ role เพื่อทำการอัปเดต")
        );
      }

      // ตรวจสอบว่า Role ที่อัปเดตเป็นค่าที่ถูกต้อง
      if (!["admin", "user"].includes(role)) {
        return sendError(
          event,
          new Error("Role ไม่ถูกต้อง! ต้องเป็น 'admin' หรือ 'user' เท่านั้น")
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { fullname, role },
      });

      return { message: "อัปเดต Role สำเร็จ", user: updatedUser };
    }

    if (method === "DELETE") {
      const query = getQuery(event);
      const id = Number(query.id);

      if (!id) {
        return sendError(event, new Error("ต้องระบุ id ของผู้ใช้ที่ต้องการลบ"));
      }

      await prisma.user.delete({ where: { id } });
      return { message: "ลบผู้ใช้สำเร็จ" };
    }
  } catch (error) {
    return sendError(event, error);
  }
});

//api//admin/users.ts//
