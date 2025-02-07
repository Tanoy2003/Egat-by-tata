export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const token = localStorage.getItem("token"); // ดึง Token
    const role = localStorage.getItem("role"); // ดึง Role ของผู้ใช้

    // ถ้าไม่มี Token หรือ Role ไม่ใช่ admin และพยายามเข้าหน้า Admin
    if (!token || (to.path.startsWith("/admin") && role !== "admin")) {
      return navigateTo("/login");
    }
  }
});
