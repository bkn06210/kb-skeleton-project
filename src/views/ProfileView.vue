<template>
  <div class="profile-view">
    <div class="section-card">
      <!-- Avatar -->
      <div class="avatar">
        <span class="avatar-text">{{ initials }}</span>
      </div>

      <!-- Name & Email -->
      <div class="form-row">
        <div class="field">
<<<<<<< HEAD
          <label class="field-label" for="input-name">이름</label>
          <input id="input-name" class="form-input" type="text" v-model="name" placeholder="이름" />
        </div>
        <div class="field">
          <label class="field-label" for="input-email">이메일</label>
          <input id="input-email" class="form-input" type="email" v-model="email" placeholder="이메일" />
=======
          <label class="field-label">Name</label>
          <input class="form-input" type="text" v-model="name" placeholder="Name" />
        </div>
        <div class="field">
          <label class="field-label">Email</label>
          <input class="form-input" type="email" v-model="email" placeholder="Email" />
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
        </div>
      </div>

      <!-- Save -->
      <div class="form-actions">
<<<<<<< HEAD
        <button class="btn btn-save" @click="save">프로필 저장</button>
=======
        <button class="btn btn-save" @click="save">Save profile</button>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '../stores/profileStore';

const profileStore = useProfileStore();

const name = ref('');
const email = ref('');

const initials = computed(() => {
  if (!name.value) return '';
  return name.value
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

onMounted(async () => {
  await profileStore.fetchProfile();
  name.value = profileStore.profile.name || '';
  email.value = profileStore.profile.email || '';
});

const save = async () => {
  if (!name.value || !email.value) return;
  await profileStore.saveProfile({ name: name.value, email: email.value });
};
</script>

<style scoped>
.profile-view {
  max-width: 680px;
  margin: 0 auto;
  padding: 4px 0 40px;
}

.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Avatar */
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

/* Layout */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  color: var(--text-muted);
}

.form-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-bright);
  font-size: 14px;
  font-family: var(--sans);
  padding: 12px 14px;
  width: 100%;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.form-input:focus {
  border-color: var(--accent);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Button */
.form-actions {
  display: flex;
}

.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sans);
  background: var(--accent);
  border: none;
  color: #fff;
  transition: background 0.15s;
<<<<<<< HEAD
  cursor: pointer;
=======
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.btn-save:hover {
  background: #2563eb;
}
</style>
