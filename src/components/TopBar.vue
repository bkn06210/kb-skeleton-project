<template>
  <div class="topbar">
    <div class="month-nav">
      <button @click="prevMonth">&#60;</button>
      <span>{{ currentMonth }}</span>
      <button @click="nextMonth">&#62;</button>
    </div>
    <button class="new-transaction-btn" @click="$router.push('/add')">
      + New transaction
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);

const currentMonth = computed(() => {
  return `${year.value}.${String(month.value).padStart(2, '0')}`;
});

const prevMonth = () => {
  if (month.value === 1) {
    month.value = 12;
    year.value--;
  } else {
    month.value--;
  }
};

const nextMonth = () => {
  if (month.value === 12) {
    month.value = 1;
    year.value++;
  } else {
    month.value++;
  }
};
</script>
