export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/admin")) {
    const authStore = useAuthStore();
    authStore.initializeAuth(); // ✅ ตรวจสอบสถานะการล็อกอินก่อน

    const role = authStore.user?.role || localStorage.getItem("role");

    console.log("🔹 User Role:", role); // ✅ Debug role

    if (role !== "admin") {
      return navigateTo("/users"); // ❌ ห้ามเข้าถ้าไม่ใช่ Admin
    }
  }
});
