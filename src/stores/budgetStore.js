import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  getBudget,
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
} from '../api/budget';
import { useMonthStore } from './monthStore';

export const useBudgetStore = defineStore('budget', () => {
  const monthStore = useMonthStore();
  const transactions = ref([]);
  const selectedPeriod = ref('all');
  const selectedType = ref('all');
  const selectedCategory = ref('all');
  const selectedSort = ref('newest');
  const customStartDate = ref('');
  const customEndDate = ref('');

  const fetchTransactions = async (params = {}) => {
    try {
      const res = await getBudget(params);
      transactions.value = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchById = async (id) => {
    const res = await getBudgetById(id);
    return res.data;
  };

  const create = async (data) => {
    await addBudget(data);
    await fetchTransactions();
  };

  const update = async (id, data) => {
    await updateBudget(id, data);
    await fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteBudget(id);
      transactions.value = transactions.value.filter((item) => item.id !== id);
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

<<<<<<< HEAD
  const availableCategories = computed(() => {
    const typeFiltered =
      selectedType.value === 'all'
        ? transactions.value
        : transactions.value.filter((t) => t.type === selectedType.value);
    const categories = typeFiltered.map((t) => t.category);
    return [...new Set(categories)];
  });

  const filteredTransactions = computed(() => {
    const filtered = transactions.value.filter((item) => {
      const matchType =
        selectedType.value === 'all' || item.type === selectedType.value;

      const matchCategory =
        selectedCategory.value === 'all' ||
        item.category === selectedCategory.value;

      let matchPeriod = true;
      if (selectedPeriod.value !== 'all') {
        const txDate = new Date(item.date);
        const now = new Date();

        if (selectedPeriod.value === 'month') {
          matchPeriod =
            txDate.getFullYear() === now.getFullYear() &&
            txDate.getMonth() === now.getMonth();
        } else if (selectedPeriod.value === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchPeriod = txDate >= oneWeekAgo && txDate <= now;
        } else if (selectedPeriod.value === 'custom') {
          if (customStartDate.value && customEndDate.value) {
            const start = new Date(customStartDate.value);
            const end = new Date(customEndDate.value);
            end.setHours(23, 59, 59, 999);
            matchPeriod = txDate >= start && txDate <= end;
          }
        }
=======
  const matchesType = (item) => {
    return selectedType.value === 'all' || item.type === selectedType.value;
  };

  const matchesPeriod = (item) => {
    if (selectedPeriod.value === 'all') {
      return true;
    }

    const txDate = new Date(item.date);
    if (Number.isNaN(txDate.getTime())) {
      return false;
    }

    if (selectedPeriod.value === 'month') {
      return (
        txDate.getFullYear() === monthStore.year &&
        txDate.getMonth() + 1 === monthStore.month
      );
    }

    if (selectedPeriod.value === 'week') {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= oneWeekAgo && txDate <= now;
    }

    if (selectedPeriod.value === 'custom') {
      const start = customStartDate.value
        ? new Date(customStartDate.value)
        : null;
      const end = customEndDate.value ? new Date(customEndDate.value) : null;

      if (start && Number.isNaN(start.getTime())) {
        return false;
      }

      if (end && Number.isNaN(end.getTime())) {
        return false;
      }

      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      if (start && txDate < start) {
        return false;
      }

      if (end && txDate > end) {
        return false;
      }
    }

    return true;
  };

  const typeAndPeriodFiltered = computed(() => {
    return transactions.value.filter(
      (item) => matchesType(item) && matchesPeriod(item),
    );
  });

  const availableCategories = computed(() => {
    const categories = typeAndPeriodFiltered.value
      .map((item) => item.category)
      .filter(Boolean);
    return [...new Set(categories)];
  });

  watch(
    availableCategories,
    (categories) => {
      if (
        selectedCategory.value !== 'all' &&
        !categories.includes(selectedCategory.value)
      ) {
        selectedCategory.value = 'all';
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
      }
    },
    { immediate: true },
  );

  const filteredTransactions = computed(() => {
    return typeAndPeriodFiltered.value.filter((item) => {
      return (
        selectedCategory.value === 'all' ||
        item.category === selectedCategory.value
      );
    });

    return [...filtered].sort((a, b) => {
      if (selectedSort.value === 'newest') return new Date(b.date) - new Date(a.date);
      if (selectedSort.value === 'oldest') return new Date(a.date) - new Date(b.date);
      if (selectedSort.value === 'amountDesc') return b.amount - a.amount;
      if (selectedSort.value === 'amountAsc') return a.amount - b.amount;
      return 0;
    });
  });

  return {
    transactions,
    selectedType,
    selectedCategory,
    selectedPeriod,
    selectedSort,
    fetchTransactions,
    fetchById,
    create,
    update,
    deleteTransaction,
    availableCategories,
    filteredTransactions,
    customStartDate,
    customEndDate,
  };
});
