<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto py-6">
      <h1 class="text-2xl font-bold mb-4">จัดการข้อมูล Users ภายในเว็บ</h1>

      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>อีเมล</th>
              <th>ชื่อเต็ม</th>
              <th>Role</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <th>{{ user.id }}</th>
              <td>{{ user.username }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.role }}</td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-error" @click="deleteUser(user.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="openEditModal(user)">
                    <Edit />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>

        <label class="block text-gray-700">ชื่อเต็ม</label>
        <input v-model="editUser.fullname" type="text" class="input-field" />

        <label class="block text-gray-700 mt-3">Role</label>
        <select v-model="editUser.role" class="input-field">
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <div class="flex justify-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="closeEditModal">ยกเลิก</button>
          <button class="btn btn-primary" @click="saveUser">บันทึก</button>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
import Trash from "~/components/admin/Trash.vue";
import Edit from "~/components/admin/Edit.vue";

// เก็บรายการผู้ใช้
const users = ref([]);

// เก็บข้อมูลที่จะแก้ไข
const isEditModalOpen = ref(false);
const editUser = ref({ id: null, fullname: "", role: "" });

// ดึงข้อมูลผู้ใช้จาก API
const fetchUser = async () => {
  try {
    const response = await fetch("/api/admin/users", { method: "GET" });
    if (!response.ok) throw new Error("แสดงข้อมูลผู้ใช้ไม่สำเร็จ");
    users.value = await response.json();
  } catch (err) {
    console.error("แสดงข้อมูลผู้ใช้ไม่สำเร็จ:", err);
  }
};

// เปิด Modal สำหรับแก้ไขข้อมูล
const openEditModal = (user) => {
  editUser.value = { ...user }; // คัดลอกข้อมูลผู้ใช้
  isEditModalOpen.value = true;
};

// ปิด Modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// อัปเดตข้อมูลผู้ใช้
const saveUser = async () => {
  try {
    const response = await fetch(`/api/admin/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editUser.value.id, // ✅ ต้องส่ง id ไปด้วย
        fullname: editUser.value.fullname,
        role: editUser.value.role,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "อัปเดตข้อมูลไม่สำเร็จ");
    }

    console.log("อัปเดตสำเร็จ:", result);

    // ปิด Modal และโหลดข้อมูลใหม่
    closeEditModal();
    await fetchUser();
  } catch (err) {
    console.error("อัปเดตข้อมูลไม่สำเร็จ:", err);
  }
};

// ลบผู้ใช้
const deleteUser = async (id) => {
  if (!confirm("คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?")) return;

  try {
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");

    // โหลดข้อมูลใหม่
    await fetchUser();
  } catch (err) {
    console.error("ลบข้อมูลไม่สำเร็จ:", err);
  }
};
definePageMeta({
  middleware: "check-role",
});

// โหลดข้อมูลเมื่อ Component ถูก mount
onMounted(fetchUser);
</script>

<style scoped>
/* ✅ Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
}

/* ✅ Input Fields */
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 4px;
}

/* ✅ Buttons */
.btn {
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #ccc;
}

.btn-error {
  background: #e53e3e;
  color: white;
}

.btn-accent {
  background: #f59e0b;
  color: white;
}
</style>
//page//admin/users/index
