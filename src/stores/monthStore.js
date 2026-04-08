import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMonthStore = defineStore('month', () => {
  const year = ref(new Date().getFullYear());
  const month = ref(new Date().getMonth() + 1);

  const label = computed(
    () => `${year.value}.${String(month.value).padStart(2, '0')}`
  );

  const yyyyMM = computed(
    () => `${year.value}-${String(month.value).padStart(2, '0')}`
  );

  const prev = () => {
    if (month.value === 1) {
      month.value = 12;
      year.value--;
    } else {
      month.value--;
    }
  };

  const next = () => {
    if (month.value === 12) {
      month.value = 1;
      year.value++;
    } else {
      month.value++;
    }
  };

  return { year, month, label, yyyyMM, prev, next };
});
