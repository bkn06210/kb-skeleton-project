<template>
  <div class="form-view">
    <div class="form-card">
      <!-- Type Toggle -->
      <div class="type-toggle">
        <button
          class="toggle-btn"
          :class="{ active: type === 'expense', expense: type === 'expense' }"
          @click="type = 'expense'"
        >
          Expense
        </button>
        <button
          class="toggle-btn"
          :class="{ active: type === 'income', income: type === 'income' }"
          @click="type = 'income'"
        >
          Income
        </button>
      </div>

      <!-- Date & Amount -->
      <div class="form-row">
        <div class="field">
          <label class="field-label">
            Date <span class="badge required">required</span>
          </label>
          <input class="form-input" type="date" v-model="date" />
        </div>
        <div class="field">
          <label class="field-label">
            Amount <span class="badge required">required</span>
          </label>
          <input
            class="form-input"
            type="text"
            inputmode="numeric"
            :value="amountDisplay"
            @input="onAmountInput"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Category & Detail Category -->
      <div class="form-row">
        <div class="field">
          <label class="field-label">
            Category <span class="badge required">required</span>
          </label>
          <CategorySelect
            class="form-select"
            v-model="category"
            :categories="
              type === 'expense' ? expenseCategories : incomeCategories
            "
          />
        </div>
        <div class="field">
          <label class="field-label">
            Detail category <span class="badge optional">optional</span>
          </label>
          <input
            class="form-input"
            type="text"
            v-model="detailCategory"
            placeholder="e.g. lunch"
          />
        </div>
      </div>

      <!-- Memo -->
      <div class="field">
        <label class="field-label">
          Memo <span class="badge optional">optional</span>
        </label>
        <textarea
          class="form-textarea"
          v-model="memo"
          placeholder="Add a note..."
          rows="4"
        />
      </div>

      <!-- Buttons -->
      <div class="form-actions">
        <button class="btn btn-save" @click="save">
          {{ isEditMode ? 'Update' : 'Save' }}
        </button>
        <button class="btn btn-cancel" @click="onCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '../stores/categoryStore';
import { useBudgetStore } from '../stores/budgetStore';
import CategorySelect from '../components/CategorySelect.vue';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const budgetStore = useBudgetStore();
const { incomeCategories, expenseCategories } = storeToRefs(categoryStore);

const getToday = () => new Date().toISOString().slice(0, 10);
const editId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : '',
);
const isEditMode = computed(() => editId.value.length > 0);

const type = ref('expense');
const date = ref(getToday());
const amount = ref(0);
const amountDisplay = ref('');
const category = ref('');
const detailCategory = ref('');
const memo = ref('');

const onAmountInput = (e) => {
  const raw = e.target.value.replace(/[^\d]/g, '');
  amount.value = raw ? Number(raw) : 0;
  amountDisplay.value = raw ? Number(raw).toLocaleString() : '';
};

const resetForm = () => {
  type.value = 'expense';
  date.value = getToday();
  amount.value = 0;
  amountDisplay.value = '';
  category.value = '';
  detailCategory.value = '';
  memo.value = '';
};

const fillForm = (data) => {
  type.value = data?.type ?? 'expense';
  date.value = data?.date ?? getToday();
  amount.value = Number(data?.amount) || 0;
  amountDisplay.value = amount.value ? amount.value.toLocaleString() : '';
  category.value = data?.category ?? '';
  detailCategory.value = data?.detailCategory ?? '';
  memo.value = data?.memo ?? '';
};

const loadTransaction = async () => {
  if (!isEditMode.value) {
    resetForm();
    return;
  }

  try {
    const data = await budgetStore.fetchById(editId.value);
    fillForm(data);
  } catch (error) {
    console.error('Failed to load transaction:', error);
    router.push('/transactions');
  }
};

onMounted(async () => {
  await categoryStore.fetchCategories();
  await loadTransaction();
});

watch(editId, async (newId, oldId) => {
  if (newId === oldId) return;
  await loadTransaction();
});

const save = async () => {
  if (!date.value || !amount.value || !category.value) return;
  const payload = {
    type: type.value,
    date: date.value,
    amount: amount.value,
    category: category.value,
    detailCategory: detailCategory.value,
    memo: memo.value,
  };

  if (isEditMode.value) {
    await budgetStore.update(editId.value, payload);
  } else {
    await budgetStore.create(payload);
  }

  router.push('/transactions');
};

const onCancel = () => router.push(isEditMode.value ? '/transactions' : '/');
</script>

<style scoped>
.form-view {
  max-width: 820px;
  margin: 0 auto;
  padding: 4px 0 40px;
}

.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Type toggle */
.type-toggle {
  display: flex;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  width: fit-content;
}

.toggle-btn {
  padding: 7px 22px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  color: var(--text-muted);
  transition:
    background 0.15s,
    color 0.15s;
}

.toggle-btn.active.expense {
  background: var(--expense);
  color: #fff;
}

.toggle-btn.active.income {
  background: var(--income);
  color: #fff;
}

/* Layout */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

/* Badges */
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

/* Inputs */
.form-input,
.form-select,
.form-textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-bright);
  font-size: 14px;
  font-family: var(--sans);
  padding: 13px 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--accent);
}

.form-select {
  appearance: auto;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 130px;
}

/* Placeholder color */
.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

/* Hide number input spinners */
.form-input::-webkit-outer-spin-button,
.form-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.form-input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sans);
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
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
</style>
