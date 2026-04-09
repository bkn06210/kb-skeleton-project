<template>
  <div class="settings-view">
    <div class="section-card budget-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">월 예산</h2>
          <p class="section-subtitle">{{ monthStore.label }} 예산 목표</p>
        </div>
        <button class="btn-save-inline" @click="saveBudget">예산 저장</button>
      </div>

      <div class="budget-summary">
        <div class="summary-badge">
          <span class="summary-label">총예산</span>
          <strong>{{ formatAmount(totalBudgetValue) }}</strong>
        </div>
        <div class="summary-badge">
          <span class="summary-label">카테고리 예산</span>
          <strong>{{ activeCategoryBudgetCount }}</strong>
        </div>
        <div class="summary-badge" :class="{ warning: budgetGap < 0 }">
          <span class="summary-label">남은 배분</span>
          <strong>{{ budgetGapLabel }}</strong>
        </div>
      </div>

      <div class="budget-form">
        <div class="field">
          <label class="field-label">
            월 총예산 <span class="badge required">필수</span>
          </label>
          <input
            class="form-input"
            type="text"
            inputmode="numeric"
            :value="totalBudgetDisplay"
            @input="onTotalBudgetInput"
            placeholder="0"
          />
        </div>

        <div class="budget-grid">
          <div
            v-for="category in expenseCategories"
            :key="category.id"
            class="budget-item"
          >
            <label class="field-label">{{ category.name }}</label>
            <input
              class="form-input"
              type="text"
              inputmode="numeric"
              :value="categoryBudgetDisplays[category.name] ?? ''"
              @input="onCategoryBudgetInput(category.name, $event)"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">고정 지출</h2>
          <p class="section-subtitle">매달 나가는 고정 지출을 관리해요</p>
        </div>
        <button class="btn-add" @click="showForm = !showForm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          추가
        </button>
      </div>

      <div v-if="showForm" class="add-form">
        <div class="form-row">
          <div class="field">
            <label class="field-label">
              카테고리 <span class="badge required">필수</span>
            </label>
            <CategorySelect
              class="form-select"
              v-model="newItem.category"
              :categories="expenseCategories"
            />
          </div>
          <div class="field">
            <label class="field-label">
              상세 항목 <span class="badge optional">선택</span>
            </label>
            <input
              class="form-input"
              type="text"
              v-model="newItem.detailCategory"
              placeholder="예: 넷플릭스"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label">
              금액 <span class="badge required">필수</span>
            </label>
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
            <label class="field-label">
              매월 날짜 <span class="badge required">필수</span>
            </label>
            <input
              class="form-input"
              type="number"
              v-model="newItem.day"
              placeholder="1"
              min="1"
              max="31"
            />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-save" @click="addItem">저장</button>
          <button class="btn btn-cancel" @click="closeForm">취소</button>
        </div>
      </div>

      <div class="expense-list">
        <div v-if="periodicExpenses.length === 0" class="empty">
          등록된 고정 지출이 없어요
        </div>
        <div
          v-for="item in periodicExpenses"
          :key="item.id"
          class="expense-item"
        >
          <div class="expense-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="expense-info">
            <span class="expense-name">{{
              item.detailCategory || item.category
            }}</span>
            <span class="expense-sub">매월 / {{ item.category }}</span>
          </div>
          <div class="expense-right">
            <span class="expense-amount">-{{ item.amount.toLocaleString() }}</span>
            <span class="expense-day">매월 {{ item.day }}일</span>
          </div>
          <button class="btn-delete" @click="removeItem(item.id)" title="삭제">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
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
import { computed, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../stores/profileStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useMonthlyBudgetStore } from '../stores/monthlyBudgetStore';
import { useMonthStore } from '../stores/monthStore';
import CategorySelect from '../components/CategorySelect.vue';

const profileStore = useProfileStore();
const categoryStore = useCategoryStore();
const monthlyBudgetStore = useMonthlyBudgetStore();
const monthStore = useMonthStore();

const { periodicExpenses } = storeToRefs(profileStore);
const { expenseCategories } = storeToRefs(categoryStore);
const { currentBudget } = storeToRefs(monthlyBudgetStore);

const showForm = ref(false);
const newAmountDisplay = ref('');
const newItem = ref({
  category: '',
  detailCategory: '',
  amount: 0,
  cycle: 'monthly',
  day: '',
});

const totalBudgetValue = ref(0);
const totalBudgetDisplay = ref('');
const categoryBudgetValues = ref({});
const categoryBudgetDisplays = ref({});

const formatAmount = (value) => Number(value || 0).toLocaleString();

const applyFormattedInput = (rawValue, valuesRef, displaysRef, key) => {
  const raw = rawValue.replace(/[^\d]/g, '');
  const amount = raw ? Number(raw) : 0;
  valuesRef.value = {
    ...valuesRef.value,
    [key]: amount,
  };
  displaysRef.value = {
    ...displaysRef.value,
    [key]: raw ? amount.toLocaleString() : '',
  };
};

const syncBudgetForm = () => {
  totalBudgetValue.value = Number(currentBudget.value?.total) || 0;
  totalBudgetDisplay.value = totalBudgetValue.value
    ? totalBudgetValue.value.toLocaleString()
    : '';

  const nextValues = {};
  const nextDisplays = {};

  expenseCategories.value.forEach((category) => {
    const amount = Number(currentBudget.value?.categories?.[category.name]) || 0;
    nextValues[category.name] = amount;
    nextDisplays[category.name] = amount ? amount.toLocaleString() : '';
  });

  categoryBudgetValues.value = nextValues;
  categoryBudgetDisplays.value = nextDisplays;
};

const loadBudget = async () => {
  await monthlyBudgetStore.fetchMonthlyBudgetByMonth(monthStore.yyyyMM);
  syncBudgetForm();
};

onMounted(async () => {
  await Promise.all([
    profileStore.fetchPeriodicExpenses(),
    categoryStore.fetchCategories(),
  ]);
  await loadBudget();
});

watch(
  () => monthStore.yyyyMM,
  async () => {
    await loadBudget();
  },
);

const activeCategoryBudgetCount = computed(() => {
  return Object.values(categoryBudgetValues.value).filter(
    (amount) => Number(amount) > 0,
  ).length;
});

const categoryBudgetTotal = computed(() => {
  return Object.values(categoryBudgetValues.value).reduce(
    (sum, amount) => sum + (Number(amount) || 0),
    0,
  );
});

const budgetGap = computed(() => totalBudgetValue.value - categoryBudgetTotal.value);

const budgetGapLabel = computed(() => {
  if (!budgetGap.value) return '0';
  if (budgetGap.value > 0) return `${formatAmount(budgetGap.value)} 남음`;
  return `${formatAmount(Math.abs(budgetGap.value))} 초과`;
});

const onTotalBudgetInput = (e) => {
  const raw = e.target.value.replace(/[^\d]/g, '');
  totalBudgetValue.value = raw ? Number(raw) : 0;
  totalBudgetDisplay.value = raw ? Number(raw).toLocaleString() : '';
};

const onCategoryBudgetInput = (categoryName, e) => {
  applyFormattedInput(
    e.target.value,
    categoryBudgetValues,
    categoryBudgetDisplays,
    categoryName,
  );
};

const saveBudget = async () => {
  await monthlyBudgetStore.saveMonthlyBudgetByMonth(monthStore.yyyyMM, {
    total: totalBudgetValue.value,
    categories: categoryBudgetValues.value,
  });
  syncBudgetForm();
};

const onNewAmountInput = (e) => {
  const raw = e.target.value.replace(/[^\d]/g, '');
  newItem.value.amount = raw ? Number(raw) : 0;
  newAmountDisplay.value = raw ? Number(raw).toLocaleString() : '';
};

const addItem = async () => {
  if (!newItem.value.category || !newItem.value.amount || !newItem.value.day) {
    return;
  }

  await profileStore.addPeriodic({ ...newItem.value });
  closeForm();
};

const closeForm = () => {
  showForm.value = false;
  newItem.value = {
    category: '',
    detailCategory: '',
    amount: 0,
    cycle: 'monthly',
    day: '',
  };
  newAmountDisplay.value = '';
};

const removeItem = async (id) => {
  await profileStore.removePeriodic(id);
};
</script>

<style scoped>
.settings-view {
  max-width: 920px;
  margin: 0 auto;
  padding: 4px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px 28px;
}

.budget-card {
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 28%),
    linear-gradient(135deg, rgba(59, 130, 246, 0.12), transparent 65%),
    var(--card-bg);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-bright);
}

.section-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.budget-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.summary-badge {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.36);
}

.summary-badge.warning {
  border-color: rgba(248, 113, 113, 0.32);
  color: #fecaca;
}

.summary-label {
  font-size: 12px;
  color: var(--text-muted);
}

.budget-form,
.add-form {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.budget-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-add,
.btn-save-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.btn-add {
  background: var(--accent-bg);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--accent);
}

.btn-save-inline {
  background: rgba(34, 197, 94, 0.16);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.btn-add:hover,
.btn-save-inline:hover {
  transform: translateY(-1px);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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
  border-radius: 10px;
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
  border-radius: 8px;
  font-size: 13px;
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
  transition:
    color 0.15s,
    background 0.15s;
}

.btn-delete:hover {
  color: var(--expense);
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 860px) {
  .budget-grid,
  .form-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
