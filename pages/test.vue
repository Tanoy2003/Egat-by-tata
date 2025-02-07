<script setup>
import { ref } from "vue";

const imageFile = ref(null);
const uploadUrl = ref(null);
const errorMessage = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
};

const uploadImage = async () => {
  if (!imageFile.value) return;

  const formData = new FormData();
  formData.append("image", imageFile.value);

  try {
    const response = await fetch("/api/admin/test", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      uploadUrl.value = result.imageUrl;
      errorMessage.value = null;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="upload-container">
    <h2>📤 ทดสอบอัปโหลดรูปไป AWS S3</h2>
    <input type="file" accept="image/*" @change="handleFileUpload" />
    <button @click="uploadImage" :disabled="!imageFile">อัปโหลด</button>

    <div v-if="uploadUrl" class="preview">
      <p>✅ อัปโหลดสำเร็จ!</p>
      <img :src="uploadUrl" alt="Uploaded Image" class="uploaded-image" />
      <p><a :href="uploadUrl" target="_blank">เปิดรูป</a></p>
    </div>

    <div v-if="errorMessage" class="error">❌ {{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.preview {
  margin-top: 20px;
}

.uploaded-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.error {
  margin-top: 10px;
  color: red;
  font-weight: bold;
}
</style>
