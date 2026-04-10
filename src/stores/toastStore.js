import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  const show = (message, type = 'success') => {
    const id = Date.now();
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 2500);
  };

  return { toasts, show };
});
