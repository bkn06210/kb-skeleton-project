<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">거래 내역 수정</span>
        <button class="close-btn" @click="$emit('cancel')">✕</button>
      </div>

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

      <div class="form-row">
        <div class="field">
          <label class="field-label">날짜 <span class="badge required">필수</span></label>
          <input class="form-input" type="date" v-model="date" />
        </div>
        <div class="field">
          <label class="field-label">금액 <span class="badge required">필수</span></label>
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

      <div class="form-row">
        <div class="field">
          <label class="field-label">카테고리 <span class="badge required">필수</span></label>
          <CategorySelect
            class="form-select"
            v-model="category"
            :categories="type === 'expense' ? expenseCategories : incomeCategories"
          />
        </div>
        <div class="field">
          <label class="field-label">상세 항목 <span class="badge optional">선택</span></label>
          <input class="form-input" type="text" v-model="detailCategory" placeholder="예: 점심" />
        </div>
      </div>

      <div class="field">
        <label class="field-label">메모 <span class="badge optional">선택</span></label>
        <textarea class="form-textarea" v-model="memo" placeholder="메모를 입력하세요" rows="3" />
      </div>

      <div class="form-actions">
        <button class="btn btn-save" @click="save">수정</button>
        <button class="btn btn-cancel" @click="$emit('cancel')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '../stores/categoryStore';
import { useBudgetStore } from '../stores/budgetStore';
import CategorySelect from './CategorySelect.vue';

const props = defineProps({
  show: Boolean,
  transactionId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['saved', 'cancel']);

const categoryStore = useCategoryStore();
const budgetStore = useBudgetStore();
const { incomeCategories, expenseCategories } = storeToRefs(categoryStore);

const type = ref('expense');
const date = ref('');
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

const fillForm = (data) => {
  type.value = data?.type ?? 'expense';
  date.value = data?.date ?? '';
  amount.value = Number(data?.amount) || 0;
  amountDisplay.value = amount.value ? amount.value.toLocaleString() : '';
  category.value = data?.category ?? '';
  detailCategory.value = data?.detailCategory ?? '';
  memo.value = data?.memo ?? '';
};

watch(
  () => props.show,
  async (val) => {
    if (!val || !props.transactionId) return;
    await categoryStore.fetchCategories();
    const data = await budgetStore.fetchById(props.transactionId);
    fillForm(data);
  },
);

const save = async () => {
  if (!date.value || !amount.value || !category.value) return;
  await budgetStore.update(props.transactionId, {
    type: type.value,
    date: date.value,
    amount: amount.value,
    category: category.value,
    detailCategory: detailCategory.value,
    memo: memo.value,
  });
  emit('saved');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 32px;
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-bright);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  transition: color 0.15s;
}

.close-btn:hover {
  color: var(--text-bright);
}

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
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.toggle-btn.active.expense {
  background: var(--expense);
  color: #fff;
}

.toggle-btn.active.income {
  background: var(--income);
  color: #fff;
}

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
.form-select,
.form-textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-bright);
  font-size: 14px;
  font-family: var(--sans);
  padding: 11px 14px;
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
  min-height: 80px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sans);
  cursor: pointer;
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

@media (max-width: 560px) {
  .modal-card {
    margin: 16px;
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
