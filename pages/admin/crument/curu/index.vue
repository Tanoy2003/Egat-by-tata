<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- ส่วนหัว -->
      <header
        class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg px-8 py-4 shadow-lg"
      >
        <h1 class="text-4xl font-extrabold text-center tracking-wide">
          ระบบจัดการข้อมูลครุภัณฑ์
        </h1>
        <p class="text-center text-sm mt-2 font-light">
          การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)
        </p>
      </header>
      <!-- ปุ่มเพิ่มรายการและช่องค้นหา -->
      <div
        class="flex-container bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between gap-6"
      >
        <!-- ปุ่มเพิ่มรายการ -->
        <RouterLink
          to="/crument/curu"
          class="bg-green-500 rounded-lg w-full py-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700 flex items-center justify-center"
        >
          <div class="flex gap-2 items-center">
            <div class="transform transition duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <p class="text-white font-bold text-lg">เพิ่มรายการ</p>
          </div>
        </RouterLink>

        <!-- ช่องค้นหา -->
        <div class="search-bar-container">
          <div class="search-bar">
            <!-- ไอคอนค้นหา -->
            <span class="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="search-icon-svg"
              >
                <path
                  d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"
                />
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <!-- ช่องค้นหา -->
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหา..."
              class="search-input"
              @keydown.enter="handleSearch"
            />
            <!-- ปุ่มเปิด Modal -->
            <button @click="handleSearch" class="search-button">ค้นหา</button>
          </div>
        </div>
      </div>

      <!-- ตาราง -->
      <div class="responsive-table bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">รายการครุภัณฑ์</h2>
        <div class="overflow-x-auto">
          <!-- เพิ่ม container ที่มี scroll -->
          <div
            class="overflow-y-auto max-h-96 rounded-lg border border-gray-300 scrollbar-custom"
          >
            <table
              class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
            >
              <thead class="bg-gray-100">
                <tr>
                  <th class="w-[50px]">ลำดับ</th>
                  <th>รูปภาพ</th>
                  <th>ชื่อรุ่น</th>
                  <th>รหัสสินทรัพย์</th>
                  <th>รายละเอียด</th>
                  <th>แก้ไข</th>
                  <th>ลบรายการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="curu in paginatedCURU" :key="curu.id">
                  <th data-label="ลำดับ">{{ curu.number }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="curu.imageUrl"
                      :src="curu.imageUrl"
                      alt="curu Image"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td data-label="ชื่อรุ่น">{{ curu.name }}</td>
                  <td data-label="รหัสสินทรัพย์">{{ curu.partnumber }}</td>
                  <td data-label="รายละเอียด">
                    <!-- เพิ่มปุ่มรายละเอียด -->
                    <button
                      @click="openModal(MODAL_TYPES.DETAILS, curu)"
                      class="preview-btn"
                      type="button"
                    >
                      รายละเอียด
                    </button>
                  </td>
                  <td data-label="แก้ไข">
                    <!-- เพิ่มปุ่มแก้ไข -->
                    <button
                      @click="openModal(MODAL_TYPES.EDIT, curu)"
                      class="edit-btn"
                      type="button"
                    >
                      แก้ไข
                    </button>
                  </td>
                  <td data-label="ลบรายการ">
                    <!-- เพิ่มปุ่มลบ -->
                    <button
                      @click="openModal(MODAL_TYPES.DELETE, curu)"
                      class="delete-btn"
                      type="button"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
                <!-- แสดงข้อความ "ไม่มีรายการ" เมื่อ filteredCURU ไม่มีข้อมูล -->
                <tr v-if="paginatedCURU.length === 0">
                  <td colspan="7" class="p-4 text-center text-gray-500">ไม่มีรายการ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="pagination-container">
            <button
              class="pagination-button-first"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
              v-if="currentPage > 4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-size"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-button"
              :class="currentPage === page ? 'pagination-active' : ''"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              class="pagination-button-last"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-size"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Modal แสดงผลลัพธ์การค้นหา -->
      <div
        v-if="modalType === 'searchResults'"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto shadow-lg relative"
        >
          <!-- ปุ่มปิด -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
          >
            ✕
          </button>
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">
            ผลลัพธ์การค้นหา
          </h2>

          <!-- แสดงจำนวนรายการที่ค้นพบ -->
          <div class="text-gray-600 text-center mb-4">
            พบ {{ filteredSearchResults.length }} รายการที่ตรงกับการค้นหา
          </div>

          <!-- ช่องพิมพ์ค้นหาภายใน modal -->
          <div class="mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="พิมพ์เพื่อค้นหา..."
              class="search-input w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="filterSearchResults"
            />
          </div>

          <!-- แสดงผลเป็นตาราง -->
          <div class="responsive-table bg-white p-6 rounded-lg shadow-lg">
            <div class="overflow-y-auto max-h-96">
              <table
                class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
              >
                <thead class="bg-gray-100">
                  <tr>
                    <th class="w-[50px]">ลำดับ</th>
                    <th>รูปภาพ</th>
                    <th>ชื่อรุ่น</th>
                    <th>รหัสสินทรัพย์</th>
                    <th>รายละเอียด</th>
                    <th>แก้ไข</th>
                    <th>ลบรายการ</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- แสดงผลข้อมูลที่ค้นหา -->
                  <tr v-for="result in filteredSearchResults" :key="result.id">
                    <th data-label="ลำดับ">{{ result.number }}</th>
                    <td data-label="รูปภาพ">
                      <img
                        v-if="result.imageUrl"
                        :src="result.imageUrl"
                        alt="Result Image"
                        class="h-16 w-16 object-cover rounded-md"
                      />
                      <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                    </td>
                    <td data-label="ชื่อรุ่น">
                      <span v-html="highlightText(result.name, searchQuery)"></span>
                    </td>
                    <td data-label="รหัสสินทรัพย์">
                      <span v-html="highlightText(result.partnumber, searchQuery)"></span>
                    </td>
                    <td data-label="รายละเอียด">
                      <button
                        @click="openModal(MODAL_TYPES.DETAILS, result)"
                        class="preview-btn"
                        type="button"
                      >
                        รายละเอียด
                      </button>
                    </td>
                    <td data-label="แก้ไข">
                      <button
                        @click="openModal(MODAL_TYPES.EDIT, result)"
                        class="edit-btn"
                        type="button"
                      >
                        แก้ไข
                      </button>
                    </td>
                    <td data-label="ลบรายการ">
                      <button
                        @click="openModal(MODAL_TYPES.DELETE, result)"
                        class="delete-btn"
                        type="button"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredSearchResults.length === 0">
                    <td colspan="7" class="p-4 text-center text-gray-500">
                      ไม่มีผลลัพธ์
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DETAILS"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="details-modal bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-auto shadow-lg relative"
        >
          <!-- ปุ่มปิดมุมขวาบน -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
          >
            ✕
          </button>

          <h2 class="responsive-h2 text-2xl font-bold mb-6 text-center text-blue-600">
            รายละเอียดครุภัณฑ์
          </h2>

          <!-- Table for Details -->
          <div class="overflow-x-auto">
            <table
              class="details-modal w-full text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ลำดับที่</th>
                  <th class="py-3 px-4 border-b border-gray-300">รหัสครุภัณฑ์</th>
                  <th class="py-3 px-4 border-b border-gray-300">รหัสสินทรัพย์</th>
                  <th class="py-3 px-4 border-b border-gray-300">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.number }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.curunumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.partnumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.detial }}</td>
                </tr>
              </tbody>
            </table>
            <table
              class="details-modal w-full mt-1 text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ยี่ห้อ</th>
                  <th class="py-3 px-4 border-b border-gray-300">รุ่น</th>
                  <th class="py-3 px-4 border-b border-gray-300">หมายเลขเครื่อง</th>
                  <th class="py-3 px-4 border-b border-gray-300">วันที่ได้มา</th>
                  <th class="py-3 px-4 border-b border-gray-300">เลขที่ใบโอน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.brand }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.name }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.usenumber }}</td>
                  <td class="py-2 px-4 border-b">{{ formatDate(selectedCURU.date) }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.detialnumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Image Preview -->
          <div class="preview-container">
            <img
              v-if="selectedCURU.imageUrl"
              :src="selectedCURU.imageUrl"
              alt="Image Preview"
              class="image-preview"
            />
            <p v-else class="text-gray-500 text-center font-semibold">ไม่มีรูปภาพ</p>
          </div>

          <!-- Close Button ด้านล่าง -->
          <div class="mt-6 flex justify-end">
            <button
              @click="closeModal"
              class="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="modalType === MODAL_TYPES.EDIT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto shadow-xl"
        >
          <h2 class="text-xl font-bold mb-6 text-center text-blue-600">
            แก้ไขข้อมูลครุภัณฑ์
          </h2>

          <!-- Edit Form -->
          <form>
            <!-- Grid Layout -->
            <div class="grid grid-cols-3 gap-6">
              <!-- Column 1 -->
              <div class="form-control">
                <label class="font-medium text-gray-700">ลำดับ</label>
                <input
                  v-model="selectedCURU.number"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกลำดับ"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">ชื่อรุ่น</label>
                <input
                  v-model="selectedCURU.name"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกชื่อรุ่น"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">ยี่ห้อ</label>
                <input
                  v-model="selectedCURU.brand"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกยี่ห้อ"
                />
              </div>

              <!-- Column 2 -->
              <div class="form-control">
                <label class="font-medium text-gray-700">รหัสครุภัณฑ์</label>
                <input
                  v-model="selectedCURU.curunumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรหัสครุภัณฑ์"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">รหัสสินทรัพย์</label>
                <input
                  v-model="selectedCURU.partnumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรหัสสินทรัพย์"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">หมายเลขเครื่อง</label>
                <input
                  v-model="selectedCURU.usenumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกหมายเลขเครื่อง"
                />
              </div>

              <!-- Column 3 -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">วันที่ได้มา</label>
                <input
                  v-model="selectedCURU.date"
                  type="datetime-local"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                />
              </div>
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">รายละเอียด</label>
                <textarea
                  v-model="selectedCURU.detial"
                  class="textarea textarea-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรายละเอียด"
                ></textarea>
              </div>
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">เลขที่ใบโอน</label>
                <input
                  v-model="selectedCURU.detialnumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกเลขที่ใบโอน"
                />
              </div>

              <!-- ช่องแสดงรูปภาพ -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">รูปภาพปัจจุบัน</label>
                <div class="flex justify-center items-center">
                  <img
                    v-if="previewImageUrl"
                    :src="previewImageUrl"
                    alt="Preview Image"
                    class="h-40 w-40 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                  <img
                    v-else-if="selectedCURU.imageUrl"
                    :src="selectedCURU.imageUrl"
                    alt="Current Image"
                    class="h-40 w-40 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                  <p
                    v-else
                    class="absolute inset-0 flex items-center justify-center text-gray-700 text-center font-semibold"
                  >
                    ไม่มีรูปภาพ
                  </p>
                </div>
              </div>

              <!-- ช่องอัปโหลดรูปภาพ -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">อัปโหลดรูปภาพใหม่ (ถ้ามี)</label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="file-input file-input-bordered w-full"
                />
                <p class="text-sm text-gray-500 mt-2">เลือกรูปภาพใหม่เพื่ออัปเดตข้อมูล</p>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-8 flex justify-end gap-4">
              <button
                @click="closeModal"
                type="button"
                class="bg-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
              <button
                @click="handleEditCURU"
                type="button"
                class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DELETE"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">ยืนยันการลบรายการ: {{ selectedC?.name }}</h2>
          <p class="text-gray-600 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button @click="deleteCURU" class="bg-red-500 text-white px-4 py-2 rounded">
              ลบรายการ
            </button>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedCURU = ref(null);
const CURU = ref([]); // ใช้เก็บข้อมูล
const modalType = ref(null);
const selectedImage = ref(null);
const sortKey = ref("number"); // ค่าเริ่มต้นคือจัดเรียงตาม "number"
const sortOrder = ref("asc"); // "asc" คือจากน้อยไปมาก, "desc" คือจากมากไปน้อย
const previewImageUrl = ref(null);
const currentPage = ref(1); // หน้าปัจจุบัน
const itemsPerPage = 10; // จำนวนรายการต่อหน้า
const maxPageDisplay = 6; // จำนวนหน้าที่แสดงใน Pagination
const filteredSearchResults = ref([]); // ผลลัพธ์การค้นหา

const filterSearchResults = () => {
  const query = searchQuery.value.trim().toLowerCase();

  // ถ้า searchQuery ไม่มีค่า ให้กำหนด filteredSearchResults เป็นว่างเปล่า
  if (!query) {
    filteredSearchResults.value = [];
    return;
  }

  // กรองข้อมูลตาม query
  filteredSearchResults.value = CURU.value.filter(
    (curu) =>
      curu.name.toLowerCase().includes(query) ||
      curu.curunumber.toLowerCase().includes(query) ||
      curu.partnumber.toLowerCase().includes(query) ||
      (curu.detial && curu.detial.toLowerCase().includes(query))
  );
};

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi"); // Regular Expression เพื่อค้นหาคำ
  return text.replace(regex, `<mark class="highlight">$1</mark>`);
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    alert("กรุณาใส่คำค้นหา");
    return;
  }

  // แปลงข้อความค้นหาเป็นตัวพิมพ์เล็กเพื่อตรวจสอบการค้นหาแบบ case-insensitive
  const query = searchQuery.value.trim().toLowerCase();

  // เพิ่มเงื่อนไขการค้นหา
  filteredSearchResults.value = CURU.value.filter(
    (curu) =>
      curu.name.toLowerCase().includes(query) || // ค้นหาใน "ชื่อรุ่น"
      curu.curunumber.toLowerCase().includes(query) || // ค้นหาใน "รหัสครุภัณฑ์"
      curu.partnumber.toLowerCase().includes(query) || // ค้นหาใน "รหัสสินทรัพย์"
      (curu.detial && curu.detial.toLowerCase().includes(query)) // ค้นหาใน "รายละเอียด" ถ้ามีข้อมูล
  );

  // เปิด modal หากมีผลลัพธ์
  modalType.value = "searchResults";
};

const MODAL_TYPES = {
  DETAILS: "details",
  EDIT: "edit",
  DELETE: "delete",
};
// ฟังก์ชั่นรีเซตฟอร์ม
const resetForm = () => {
  selectedImage.value = null;
  previewImageUrl.value = null;
};

// แบ่งข้อมูลตาม Pagination
const paginatedCURU = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredCURU.value.slice(startIndex, endIndex);
});

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => Math.ceil(filteredCURU.value.length / itemsPerPage));

// คำนวณหน้าที่จะแสดงใน Pagination (สูงสุด 6 หน้า)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxPageDisplay) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(1, current - Math.floor(maxPageDisplay / 2));
  const end = Math.min(total, start + maxPageDisplay - 1);

  if (end - start + 1 < maxPageDisplay && start > 1) {
    return Array.from({ length: maxPageDisplay }, (_, i) => end - maxPageDisplay + i + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredCURU = computed(() => {
  let filtered = CURU.value;

  // จัดเรียงข้อมูล
  return filtered.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];

    if (sortOrder.value === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });
});

const fetchCURU = async () => {
  try {
    const response = await fetch("/api/admin/crument/curu/curu", { method: "GET" });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    CURU.value = await response.json();
    console.log("CURU data:", CURU.value);
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const handleEditCURU = async () => {
  if (!selectedCURU.value) return;
  console.log("Selected CURU:", selectedCURU.value);

  const formData = new FormData();
  formData.append("id", selectedCURU.value.id);
  formData.append("number", selectedCURU.value.number);
  formData.append("name", selectedCURU.value.name);
  formData.append("brand", selectedCURU.value.brand);
  formData.append("curunumber", selectedCURU.value.curunumber);
  formData.append("partnumber", selectedCURU.value.partnumber);
  formData.append("usenumber", selectedCURU.value.usenumber);

  // แปลงค่า date เป็น ISO-8601 string
  const formattedDate = new Date(selectedCURU.value.date).toISOString();
  formData.append("date", formattedDate); // ส่งค่า date ที่แปลงแล้ว

  formData.append("detial", selectedCURU.value.detial);
  formData.append("detialnumber", selectedCURU.value.detialnumber);

  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  }

  // Log FormData contents
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {
    const response = await fetch("/api/admin/crument/curu/curu", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Response from server:", responseText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Refresh the data and close modal
    await fetchCURU();
    closeModal();
    toast.success("แก้ไขข้อมูลสำเร็จ!", {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  } catch (err) {
    alert("แก้ไขข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImage.value = null;
    previewImageUrl.value = null;
    return;
  }

  // ตรวจสอบประเภทและขนาดของไฟล์
  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
    return;
  }

  selectedImage.value = file;
  previewImageUrl.value = URL.createObjectURL(file);
};

const deleteCURU = async (id) => {
  if (!selectedCURU.value) return;
  try {
    const response = await $fetch(`/api/admin/crument/curu/${selectedCURU.value.id}`, {
      method: "DELETE",
    });
    console.log("resDel : ", response);
    // Refresh list
    await fetchCURU();
    closeModal();
    toast.error("ลบข้อมูลสำเร็จ!", {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  } catch (err) {
    // Show error notification
    useToast().error("ไม่สามารถลบวัสดุได้");
    console.error("Error deleting material:", err);
  }
};

const openModal = (type, curu) => {
  modalType.value = type;
  selectedCURU.value = curu;
  console.log("Modal Type:", modalType.value);
  console.log("Selected CURU:", selectedCURU.value);
};

const closeModal = () => {
  resetForm(); // เรียกฟังก์ชันรีเซ็ตฟอร์ม
  modalType.value = null;
  selectedCURU.value = null;
  filteredSearchResults.value = []; // ล้างผลลัพธ์การค้นหา
};

onMounted(async () => {
  await fetchCURU();
  console.log("CURU Data:", CURU.value);
});
definePageMeta({
  middleware: "check-role",
});
</script>

<style scoped>
/* General Styles */
input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

button {
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}
/* ปุ่ม Edit */
.edit-btn {
  background-color: #f59e0b; /* สีเหลือง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.edit-btn:hover {
  background-color: #d97706; /* สีเหลืองเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-btn:active {
  transform: scale(0.97);
}
/* ปุ่มลบ */
.delete-btn {
  background-color: #e11d48; /* สีแดง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn:active {
  transform: scale(0.97);
}

/* จัดตำแหน่งรูปภาพให้อยู่ตรงกลาง */
td[data-label="รูปภาพ"] {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่ตรงกลางแนวนอน */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  height: 100%; /* ให้เต็มความสูงของช่อง */
}

/* ตาราง */
.table-auto {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}

.table-auto th,
.table-auto td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.table-auto th {
  background-color: #007bff; /* สีหัวตาราง */
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
}

.table-auto td {
  background-color: #ffffff;
  font-size: 14px;
  color: #4b5563;
  vertical-align: middle;
  transition: background-color 0.3s;
}

.table-auto tr:nth-child(even) td {
  background-color: #f9fafb;
}

.table-auto tr:hover td {
  background-color: #e3f2fd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 12px; /* ความกว้างของ Scrollbar */
  background-color: #f5f5f5; /* สีพื้นหลังของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #007bff; /* สีของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
  border: 3px solid #f5f5f5; /* ระยะห่างของ Scrollbar */
  transition: background-color 0.3s, border-color 0.3s; /* เพิ่มเอฟเฟกต์ */
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #0056b3; /* สีเข้มขึ้นเมื่อ Hover */
  border-color: #e0e7ff; /* เปลี่ยนสีขอบเมื่อ Hover */
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #e9ecef; /* สีพื้นหลังของ Track */
  border-radius: 6px; /* มุมโค้งของ Track */
  margin: 4px; /* ระยะห่างระหว่าง Track */
}

/* ปุ่ม Preview */
.preview-btn {
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  gap: 8px; /* ระยะห่างระหว่างไอคอนกับข้อความ */
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.preview-btn:hover {
  background-color: #4338ca;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-btn:active {
  transform: scale(0.97);
}

.preview-btn svg {
  width: 16px; /* ขนาดไอคอน */
  height: 16px;
}

.preview-btn span {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  input {
    font-size: 14px;
    padding: 10px;
  }

  .download-btn,
  .delete-btn,
  .preview-btn {
    font-size: 12px;
    padding: 10px 16px;
  }

  .table-auto th,
  .table-auto td {
    font-size: 12px;
    padding: 10px;
  }
}
th,
td {
  border-right: 1px solid #d1d5db; /* เส้นแนวตั้งสีเทาอ่อน */
}

th:last-child,
td:last-child {
  border-right: none; /* ไม่แสดงเส้นแนวตั้งในคอลัมน์สุดท้าย */
}
/* 🎯 ดีไซน์พื้นฐานสำหรับตารางใน Details Modal */
.details-modal {
  width: 90%;
  max-width: 800px;
  padding: 20px;
}

.details-modal table {
  width: 100%;
  border-collapse: collapse;
}

.details-modal th,
.details-modal td {
  text-align: center;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
}

/* 🌍 สำหรับจอใหญ่ (Desktop) */
.details-modal th {
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 16px;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.details-modal td {
  color: #4b5563;
}

.details-modal tr:nth-child(even) td {
  background-color: #f9fafb;
}

.details-modal tr:hover td {
  background-color: #e3f2fd;
}

/* 📲 ปรับขนาดสำหรับแท็บเล็ต (หน้าจอกลาง) */
@media (max-width: 1024px) {
  .details-modal {
    max-width: 700px;
    padding: 16px;
  }

  .details-modal th,
  .details-modal td {
    font-size: 15px;
    padding: 10px;
  }
}

/* 📱 ปรับขนาดสำหรับมือถือ (หน้าจอเล็ก) */
@media (max-width: 768px) {
  .details-modal {
    width: 95%;
    max-width: 600px;
    padding: 14px;
    overflow-x: auto;
  }

  .details-modal table {
    min-width: 500px;
  }

  .details-modal th,
  .details-modal td {
    font-size: 10px;
    padding: 8px;
  }
}

/* 📳 ปรับขนาดสำหรับมือถือขนาดเล็กมาก (ต่ำกว่า 480px) */
@media (max-width: 480px) {
  .details-modal {
    width: 95%;
    max-width: 100%;
    padding: 12px;
  }

  .details-modal table {
    min-width: 300px;
  }

  .details-modal th,
  .details-modal td {
    font-size: 8.5px;
    padding: 6px;
  }
}

/* 🖼️ ปรับขนาดรูปภาพให้เหมาะสม */
.details-modal td img {
  max-width: 100px;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

/* 🎯 ปรับปุ่มปิด modal */
.details-modal button {
  font-size: 14px;
  padding: 8px 12px;
}

/* 🎯 ปรับปุ่มให้อยู่กึ่งกลาง */
.details-modal .modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
.preview-container {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  width: 100%; /* ความกว้างเต็มที่ของ container */
  max-width: 500px; /* จำกัดความกว้างสูงสุด */
  max-height: 400px; /* จำกัดความสูงสูงสุด */
  background-color: #ffffff; /* สีพื้นหลัง */
  border: 2px solid #007bff; /* ขอบสีน้ำเงิน */
  border-radius: 16px; /* มุมโค้ง */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* เพิ่มเงา */
  padding: 16px; /* เพิ่มระยะห่างภายใน */
  margin: 20px auto; /* ระยะห่างจากส่วนอื่นๆ */
  overflow: hidden; /* ซ่อนส่วนที่เกิน */
  position: relative; /* ใช้สำหรับการวางตำแหน่ง */
  text-align: center; /* จัดข้อความให้อยู่กึ่งกลางแนวนอน */
  transition: transform 0.3s, box-shadow 0.3s; /* เพิ่มเอฟเฟกต์เมื่อ Hover */
}

.preview-container:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

.image-preview {
  max-width: 100%; /* จำกัดความกว้างตามขนาดของ container */
  max-height: 300px; /* กำหนดความสูงสูงสุด */
  object-fit: cover; /* ตัดภาพให้อยู่ในอัตราส่วน */
  border-radius: 8px; /* เพิ่มมุมโค้งให้รูปภาพ */
  transition: transform 0.3s ease; /* เอฟเฟกต์เมื่อ Hover */
}

.image-preview:hover {
  transform: scale(1.05); /* ขยายเล็กน้อยเมื่อ Hover */
}

.preview-container p {
  font-size: 16px; /* ขนาดตัวอักษร */
  color: #6b7280; /* สีข้อความ */
  font-weight: bold; /* ตัวหนา */
}
/* Container ของ Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px;
  background-color: #f7fafc; /* พื้นหลังอ่อน */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}

/* ปุ่ม Pagination ทั่วไป */
.pagination-button,
.pagination-button-first,
.pagination-button-last {
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #e3f2fd; /* สีฟ้าอ่อน */
  color: #1c4e80; /* สีน้ำเงินเข้ม */
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #cfe3f4; /* ขอบฟ้าอ่อน */
  transition: all 0.3s ease;
}

/* Hover Effect */
.pagination-button:hover,
.pagination-button-first:hover,
.pagination-button-last:hover {
  background-color: #2c5282; /* สีฟ้าเข้มเมื่อ Hover */
  color: #ffffff; /* สีขาว */
  border-color: #1c4e80;
}

/* ปุ่มที่ถูกเลือก */
.pagination-active {
  background-color: #1c4e80; /* สีน้ำเงิน EGAT */
  color: #ffffff;
  font-weight: bold;
  border: 2px solid #1c4e80;
  box-shadow: 0 4px 8px rgba(28, 78, 128, 0.4); /* เพิ่มเงา */
}

/* ปุ่ม Disabled */
button:disabled {
  background-color: #f0f4f8; /* สีเทาอ่อน */
  color: #a0aec0; /* สีเทา */
  cursor: not-allowed;
  border-color: #e2e8f0;
}

/* ไอคอนในปุ่ม */
.icon-size {
  width: 24px;
  height: 24px;
}

/* เพิ่มเอฟเฟกต์ไอคอน */
.pagination-button svg,
.pagination-button-first svg,
.pagination-button-last svg {
  transition: transform 0.3s ease;
}

.pagination-button:hover svg,
.pagination-button-first:hover svg,
.pagination-button-last:hover svg {
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ Hover */
}

/* Responsive Design */
@media (max-width: 768px) {
  .pagination-container {
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
  }

  .pagination-button,
  .pagination-button-first,
  .pagination-button-last {
    padding: 6px 12px;
    font-size: 14px;
  }

  .icon-size {
    width: 20px;
    height: 20px;
  }
}
/* Search Bar Container */
.search-bar-container {
  width: 100%;
  max-width: 700px; /* ปรับให้มีขนาดเหมาะสมกับ Desktop */
  margin: auto;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  border: 2px solid #ffc107; /* สีเหลือง EGAT */
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

/* Search Icon */
.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0.5rem;
}

.search-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  fill: #ffc107;
}

/* Search Input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #374151;
  padding: 0.5rem 1rem;
  background-color: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Search Button */
.search-button {
  background-color: #ffc107;
  color: #374151;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.search-button:hover {
  background-color: #f9a825;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem;
    border-radius: 12px;
  }

  .search-icon {
    display: none; /* ซ่อนไอคอนในมือถือ */
  }

  .search-input {
    font-size: 14px;
    padding: 10px;
    width: 100%;
    text-align: center; /* จัดให้ข้อความอยู่ตรงกลาง */
  }

  .search-button {
    width: 100%;
    margin-top: 8px;
    font-size: 14px;
    padding: 10px;
  }
}
/* Responsive สำหรับมือถือขนาดเล็ก */
@media (max-width: 480px) {
  .search-bar {
    padding: 0.2rem 0.4rem;
  }

  .search-input {
    font-size: 0.85rem;
    padding: 0.2rem;
  }

  .search-button {
    font-size: 0.85rem;
    padding: 0.2rem 0.4rem;
  }

  .search-icon-svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  .search-bar-container {
    width: 100%;
  }
}
/* Custom Scrollbar Styling */
.scrollbar-custom {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #4a90e2 #f0f0f0; /* สี Thumb และ Track */
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px; /* ความกว้างของ Scrollbar */
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #0073e6); /* สีไล่ระดับของ Thumb */
  border-radius: 4px; /* ทำมุม Scrollbar ให้โค้งมน */
  border: 2px solid #f0f0f0; /* ขอบสีรอบ Thumb */
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0073e6, #0056b3); /* เปลี่ยนสีเมื่อ Hover */
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #f9f9f9; /* สีของ Track */
  border-radius: 4px; /* ทำมุม Track ให้โค้งมน */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาใน Track */
}
/* ปรับขนาดและการจัดเรียงช่องค้นหา และปุ่มเพิ่มรายการ */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem; /* ระยะห่างระหว่างปุ่มและช่องค้นหา */
  margin-bottom: 1rem;
}

/* Responsive สำหรับ Tablet และมือถือ */
@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
    align-items: stretch; /* ทำให้เต็มความกว้าง */
    gap: 0.75rem;
  }
}
/* ป้องกัน header ขึ้นบรรทัดใหม่ */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap; /* ป้องกันข้อความขึ้นบรรทัดใหม่ */
  overflow: hidden;
}

header h1 {
  font-size: 2.5rem; /* ขนาดตัวอักษรปกติ */
  font-weight: bold;
  text-overflow: ellipsis; /* ถ้าข้อความยาวเกินไปให้ขึ้น … */
  max-width: 100%;
}

header p {
  font-size: 1rem;
}

/* --- 📱 Responsive สำหรับหน้าจอขนาดเล็ก --- */
@media (max-width: 1024px) {
  header h1 {
    font-size: 1.5rem; /* ลดขนาดตัวอักษร */
  }

  header p {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  header {
    padding: 10px; /* ลด padding ให้เล็กลง */
  }

  header h1 {
    font-size: 1.5rem; /* ลดขนาด font */
  }

  header p {
    font-size: 0.85rem;
  }
}

/* สำหรับมือถือขนาดเล็กมาก */
@media (max-width: 480px) {
  header {
    padding: 8px;
  }

  header h1 {
    font-size: 1rem; /* ลดขนาดลงเพื่อไม่ให้ล้น */
  }

  header p {
    font-size: 0.8rem;
  }
}
/* 🌍 สำหรับ Desktop - ใช้ตารางปกติ */
@media (min-width: 769px) {
  .responsive-table table {
    display: table;
    width: 100%;
  }
  .responsive-table thead {
    display: table-header-group;
  }
  .responsive-table tbody {
    display: table-row-group;
  }
  .responsive-table tr {
    display: table-row;
  }
  .responsive-table th,
  .responsive-table td {
    display: table-cell;
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }
}

/* 📱 ปรับสำหรับมือถือ → ใช้ Card แทน Table */
@media (max-width: 768px) {
  .responsive-table table,
  .responsive-table thead,
  .responsive-table tbody,
  .responsive-table th,
  .responsive-table td,
  .responsive-table tr {
    display: block;
    width: 100%;
  }

  .responsive-table thead {
    display: none; /* ซ่อนหัวตาราง */
  }

  .responsive-table tbody tr {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
    padding: 16px;
    border: 1px solid #e5e7eb;
  }

  /* ปรับแต่ละ cell ให้แสดงแบบ 2 คอลัมน์ */
  .responsive-table tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
  }

  /* ลบเส้นขอบแถวสุดท้าย */
  .responsive-table tbody td:last-child {
    border-bottom: none;
  }

  /* ทำให้ชื่อของแต่ละ cell อยู่ฝั่งซ้าย */
  .responsive-table tbody td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #003c71;
    flex-shrink: 0;
    width: 50%;
    text-align: left;
    padding-right: 12px;
  }

  /* ข้อมูลให้อยู่ฝั่งขวา */
  .responsive-table tbody td span {
    width: 50%;
    text-align: right;
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }

  /* ปรับขนาดรูปภาพใน Card */
  .responsive-table tbody td img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-left: auto;
    border: 2px solid #e5e7eb;
  }

  /* ปรับขนาดปุ่มให้เหมาะกับมือถือ */
  .responsive-table .preview-btn,
  .responsive-table .edit-btn,
  .responsive-table .delete-btn {
    font-size: 12px;
    width: 80px;
    padding: 6px 12px;
  }
}

/* 📳 ปรับ Card View ให้พอดีกับมือถือเล็กมาก */
@media (max-width: 480px) {
  .responsive-table tbody tr {
    padding: 12px;
  }

  .responsive-table tbody td {
    font-size: 13px;
    padding: 8px 0;
  }

  .responsive-table tbody td::before {
    width: 40%;
  }

  .responsive-table tbody td span {
    width: 60%;
  }

  .responsive-table tbody td img {
    width: 60px;
    height: 60px;
  }

  /* ปรับขนาดปุ่มให้เหมาะกับมือถือ */
  .responsive-table .preview-btn,
  .responsive-table .edit-btn,
  .responsive-table .delete-btn {
    font-size: 9px;
    width: 60px;
    padding: 6px 12px;
    text-align: center;
  }
}
/* 🎯 ดีไซน์พื้นฐานสำหรับ h2 */
.responsive-h2 {
  font-size: 2rem; /* ค่าเริ่มต้น */
  font-weight: bold;
  text-align: center;
  color: #1e40af; /* สีฟ้า */
  margin-bottom: 24px;
  line-height: 1.3;
  white-space: nowrap; /* ป้องกันขึ้นบรรทัดใหม่ */
  overflow: hidden; /* ซ่อนส่วนที่เกิน */
  text-overflow: ellipsis; /* เพิ่ม ... ถ้าข้อความยาวเกิน */
}

/* 🌍 สำหรับจอใหญ่ (Desktop) */
@media (min-width: 1200px) {
  .responsive-h2 {
    font-size: 1.7rem;
  }
}

/* 📲 ปรับขนาดสำหรับแท็บเล็ต (หน้าจอกลาง) */
@media (max-width: 1024px) {
  .responsive-h2 {
    font-size: 1.3rem;
  }
}

/* 📱 ปรับขนาดสำหรับมือถือ (หน้าจอเล็ก) */
@media (max-width: 768px) {
  .responsive-h2 {
    font-size: 1.1rem;
  }
}

/* 📳 ปรับขนาดสำหรับมือถือขนาดเล็กมาก (ต่ำกว่า 480px) */
@media (max-width: 480px) {
  .responsive-h2 {
    font-size: 0.9rem;
  }
}
</style>
//admin//crument//curu//index.vue//dont.fuse
