import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getIncomeCategory, getExpenseCategory } from '../api/category';

export const useCategoryStore = defineStore('category', () => {
  const incomeCategories = ref([]);
  const expenseCategories = ref([]);

  const fetchCategories = async () => {
    const income = await getIncomeCategory();
    const expense = await getExpenseCategory();
    incomeCategories.value = income.data;
    expenseCategories.value = expense.data;
  };

  return { incomeCategories, expenseCategories, fetchCategories };
});
