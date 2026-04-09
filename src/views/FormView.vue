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
          지출
        </button>
        <button
          class="toggle-btn"
          :class="{ active: type === 'income', income: type === 'income' }"
          @click="type = 'income'"
        >
          수입
        </button>
      </div>

      <!-- Date & Amount -->
      <div class="form-row">
        <div class="field">
          <label class="field-label">
            날짜 <span class="badge required">필수</span>
          </label>
          <input class="form-input" type="date" v-model="date" />
        </div>
        <div class="field">
          <label class="field-label">
            금액 <span class="badge required">필수</span>
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
            카테고리 <span class="badge required">필수</span>
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
            세부 카테고리 <span class="badge optional">선택</span>
          </label>
          <input
            class="form-input"
            type="text"
            v-model="detailCategory"
            placeholder="예) 점심"
          />
        </div>
      </div>

      <!-- Memo -->
      <div class="field">
        <label class="field-label">
          메모 <span class="badge optional">선택</span>
        </label>
        <textarea
          class="form-textarea"
          v-model="memo"
          placeholder="메모를 입력하세요"
          rows="4"
        />
      </div>

      <!-- Buttons -->
      <div class="form-actions">
        <button class="btn btn-save" @click="save">저장</button>
        <button class="btn btn-cancel" @click="onCancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '../stores/categoryStore';
import { useBudgetStore } from '../stores/budgetStore';
import CategorySelect from '../components/CategorySelect.vue';

const router = useRouter();
const categoryStore = useCategoryStore();
const budgetStore = useBudgetStore();
const { incomeCategories, expenseCategories } = storeToRefs(categoryStore);

const type = ref('expense');
const date = ref(new Date().toISOString().slice(0, 10));
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

onMounted(() => categoryStore.fetchCategories());

const save = async () => {
  if (!date.value || !amount.value || !category.value) return;
  await budgetStore.create({
    type: type.value,
    date: date.value,
    amount: amount.value,
    category: category.value,
    detailCategory: detailCategory.value,
    memo: memo.value,
  });
  router.push('/transactions');
};

const onCancel = () => router.push('/');
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
