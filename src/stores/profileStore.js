import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getProfile,
  updateProfile,
  getPeriodicExpense,
  addPeriodicExpense,
  deletePeriodicExpense,
} from '../api/profile';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({});
  const periodicExpenses = ref([]);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      profile.value = res.data;
    } catch {
      // API unavailable, keep default empty profile
    }
  };

  const saveProfile = async (data) => {
    await updateProfile(data);
    await fetchProfile();
  };

  const fetchPeriodicExpenses = async () => {
    const res = await getPeriodicExpense();
    periodicExpenses.value = res.data;
  };

  const addPeriodic = async (data) => {
    await addPeriodicExpense(data);
    await fetchPeriodicExpenses();
  };

  const removePeriodic = async (id) => {
    await deletePeriodicExpense(id);
    await fetchPeriodicExpenses();
  };

  return {
    profile,
    periodicExpenses,
    fetchProfile,
    saveProfile,
    fetchPeriodicExpenses,
    addPeriodic,
    removePeriodic,
  };
});
