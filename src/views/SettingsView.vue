<template>
  <div class="settings-view">
    <!-- Recurring Expenses -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">Recurring expenses</h2>
        <button class="btn-add" @click="showForm = !showForm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>
      </div>

      <!-- Add Form -->
      <div v-if="showForm" class="add-form">
        <div class="form-row">
          <div class="field">
            <label class="field-label">Category <span class="badge required">required</span></label>
            <CategorySelect
              class="form-select"
              v-model="newItem.category"
              :categories="expenseCategories"
            />
          </div>
          <div class="field">
            <label class="field-label">Detail <span class="badge optional">optional</span></label>
            <input class="form-input" type="text" v-model="newItem.detailCategory" placeholder="e.g. Netflix" />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label">Amount <span class="badge required">required</span></label>
            <input
              class="form-input"
              type="text"
              inputmode="numeric"
              :value="newAmountDisplay"
              @input="onNewAmountInput"
              placeholder="0"
            />
          </div>
          <div class="field">
            <label class="field-label">Day of month <span class="badge required">required</span></label>
            <input class="form-input" type="number" v-model="newItem.day" placeholder="1" min="1" max="31" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-save" @click="addItem">Save</button>
          <button class="btn btn-cancel" @click="closeForm">Cancel</button>
        </div>
      </div>

      <!-- List -->
      <div class="expense-list">
        <div v-if="periodicExpenses.length === 0" class="empty">
          No recurring expenses
        </div>
        <div v-for="item in periodicExpenses" :key="item.id" class="expense-item">
          <div class="expense-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="expense-info">
            <span class="expense-name">{{ item.detailCategory || item.category }}</span>
            <span class="expense-sub">Monthly / {{ item.category }}</span>
          </div>
          <div class="expense-right">
            <span class="expense-amount">-{{ item.amount.toLocaleString() }}</span>
            <span class="expense-day">Every {{ item.day }}{{ daySuffix(item.day) }}</span>
          </div>
          <button class="btn-delete" @click="removeItem(item.id)" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../stores/profileStore';
import { useCategoryStore } from '../stores/categoryStore';
import CategorySelect from '../components/CategorySelect.vue';

const profileStore = useProfileStore();
const categoryStore = useCategoryStore();
const { periodicExpenses } = storeToRefs(profileStore);
const { expenseCategories } = storeToRefs(categoryStore);

const showForm = ref(false);
const newAmountDisplay = ref('');
const newItem = ref({ category: '', detailCategory: '', amount: 0, cycle: 'monthly', day: '' });

onMounted(async () => {
  await profileStore.fetchPeriodicExpenses();
  await categoryStore.fetchCategories();
});

const onNewAmountInput = (e) => {
  const raw = e.target.value.replace(/[^\d]/g, '');
  newItem.value.amount = raw ? Number(raw) : 0;
  newAmountDisplay.value = raw ? Number(raw).toLocaleString() : '';
};

const addItem = async () => {
  if (!newItem.value.category || !newItem.value.amount || !newItem.value.day) return;
  await profileStore.addPeriodic({ ...newItem.value });
  closeForm();
};

const closeForm = () => {
  showForm.value = false;
  newItem.value = { category: '', detailCategory: '', amount: 0, cycle: 'monthly', day: '' };
  newAmountDisplay.value = '';
};

const removeItem = async (id) => {
  await profileStore.removePeriodic(id);
};

const daySuffix = (day) => {
  if (day === 1 || day === 21 || day === 31) return 'st';
  if (day === 2 || day === 22) return 'nd';
  if (day === 3 || day === 23) return 'rd';
  return 'th';
};
</script>

<style scoped>
.settings-view {
  max-width: 680px;
  margin: 0 auto;
  padding: 4px 0 40px;
}

.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-bright);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--accent-bg);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.15s;
}

.btn-add:hover {
  background: rgba(59, 130, 246, 0.2);
}

/* Add Form */
.add-form {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge.required {
  background: rgba(239, 68, 68, 0.15);
  color: var(--expense);
}

.badge.optional {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent);
}

.form-input,
.form-select {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-bright);
  font-size: 14px;
  font-family: var(--sans);
  padding: 10px 12px;
  width: 100%;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--accent);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input::-webkit-outer-spin-button,
.form-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 20px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--sans);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn-save {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text-bright);
}

.btn-save:hover {
  background: rgba(255, 255, 255, 0.07);
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-cancel:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

/* Expense List */
.empty {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  padding: 24px 0;
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.expense-item:last-child {
  border-bottom: none;
}

.expense-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(202, 138, 4, 0.15);
  color: #ca8a04;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.expense-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.expense-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-bright);
}

.expense-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.expense-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.expense-amount {
  font-size: 14px;
  font-weight: 600;
  color: var(--expense);
}

.expense-day {
  font-size: 12px;
  color: var(--text-muted);
}

.btn-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
}

.btn-delete:hover {
  color: var(--expense);
  background: rgba(239, 68, 68, 0.1);
}
</style>
