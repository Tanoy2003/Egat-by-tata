export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.startsWith("/admin")) {
    const authStore = useAuthStore();
    await authStore.initializeAuth(); // ✅ โหลดข้อมูลก่อน

    const role = authStore.user?.role || localStorage.getItem("role");

    console.log("🔹 Middleware User Role:", role);
    console.log("🔹 กำลังเช็คสิทธิ์เข้า admin...");

    if (role !== "admin") {
      console.log("🚨 เปลี่ยนเส้นทางไป /users เพราะไม่ใช่ admin");
      return navigateTo("/users");
    }
  }
});

//middleware/check-role.ts
