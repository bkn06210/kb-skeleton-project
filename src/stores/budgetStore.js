import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getBudget,
  getBudgetById,
  addBudget,
  updateBudget,
  deleteBudget,
} from '../api/budget';

export const useBudgetStore = defineStore('budget', () => {
  const budgetList = ref([]);

  const fetchAll = async (params = {}) => {
    const res = await getBudget(params);
    budgetList.value = res.data;
  };

  const fetchById = async (id) => {
    const res = await getBudgetById(id);
    return res.data;
  };

  const create = async (data) => {
    await addBudget(data);
    await fetchAll();
  };

  const update = async (id, data) => {
    await updateBudget(id, data);
    await fetchAll();
  };

  const remove = async (id) => {
    await deleteBudget(id);
    await fetchAll();
  };

  return { budgetList, fetchAll, fetchById, create, update, remove };
});
