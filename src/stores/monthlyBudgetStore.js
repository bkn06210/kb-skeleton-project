import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getMonthlyBudget,
  createMonthlyBudget,
  updateMonthlyBudget,
} from '../api/monthlyBudget';

const createDefaultBudget = (month = '') => ({
  id: '',
  month,
  total: 0,
  categories: {},
});

const normalizeBudget = (data, month) => ({
  ...createDefaultBudget(month),
  ...data,
  month: data?.month ?? month,
  categories: data?.categories ?? {},
});

const normalizeCategoryPayload = (categories = {}) => {
  return Object.fromEntries(
    Object.entries(categories)
      .map(([name, amount]) => [name, Number(amount) || 0])
      .filter(([, amount]) => amount > 0),
  );
};

export const useMonthlyBudgetStore = defineStore('monthlyBudget', () => {
  const currentBudget = ref(createDefaultBudget());

  const fetchMonthlyBudgetByMonth = async (month) => {
    try {
      const res = await getMonthlyBudget(month);
      const budget = res.data?.[0];
      currentBudget.value = budget
        ? normalizeBudget(budget, month)
        : createDefaultBudget(month);
    } catch (error) {
      console.error('Failed to fetch monthly budget:', error);
      currentBudget.value = createDefaultBudget(month);
    }
  };

  const saveMonthlyBudgetByMonth = async (month, payload) => {
    const data = {
      id: currentBudget.value?.id || month,
      month,
      total: Number(payload?.total) || 0,
      categories: normalizeCategoryPayload(payload?.categories),
    };

    if (currentBudget.value?.id) {
      await updateMonthlyBudget(currentBudget.value.id, data);
    } else {
      await createMonthlyBudget(data);
    }

    currentBudget.value = normalizeBudget(data, month);
  };

  return {
    currentBudget,
    fetchMonthlyBudgetByMonth,
    saveMonthlyBudgetByMonth,
  };
});
