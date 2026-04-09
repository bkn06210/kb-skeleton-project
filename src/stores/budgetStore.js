import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getBudget,
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
} from '../api/budget';

export const useBudgetStore = defineStore('budget', () => {
  const transactions = ref([]);
  const selectedPeriod = ref('month');
  const selectedType = ref('all');
  const selectedCategory = ref('all');
  const customStartDate = ref('');
  const customEndDate = ref('');

  const fetchTransactions = async (params = {}) => {
    try {
      const res = await getBudget(params);

      transactions.value = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
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

  const availableCategories = computed(() => {
    const typeFiltered =
      selectedType.value === 'all'
        ? transactions.value
        : transactions.value.filter((t) => t.type === selectedType.value);

    const categories = typeFiltered.map((t) => t.category);
    return [...new Set(categories)];
  });

  const filteredTransactions = computed(() => {
    return transactions.value.filter((item) => {
      // 1. 타입 필터
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
          } else {
            matchPeriod = true;
          }
        }
      }

      return matchType && matchCategory && matchPeriod;
    });
  });

  return {
    transactions,
    selectedType,
    selectedCategory,
    selectedPeriod,
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
