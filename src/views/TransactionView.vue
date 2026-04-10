<template>
  <div class="transaction-view">
    <div class="filters-section">
      <div class="filters-top">
        <span class="filters-title">필터</span>
        <button class="reset-btn" @click="handleResetFilters">초기화</button>
      </div>

      <div class="filter-group">
        <span class="filter-label">타입</span>
        <div class="toggle-group">
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'all' }"
            @click="selectedType = 'all'"
          >전체</button>
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'income' }"
            @click="selectedType = 'income'"
          >수입</button>
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'expense' }"
            @click="selectedType = 'expense'"
          >지출</button>
        </div>
      </div>

      <div class="filter-group filter-group-period">
        <span class="filter-label period-label">기간</span>
        <div class="period-content">
          <div class="chip-group">
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'month' }"
              @click="handlePeriodClick('month')"
            >
              이번 달
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'week' }"
              @click="handlePeriodClick('week')"
            >
              최근 7일
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'custom' }"
              @click="handlePeriodClick('custom')"
            >
              직접 설정
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'all' }"
              @click="handlePeriodClick('all')"
            >
              전체
            </button>
          </div>

          <div v-if="selectedPeriod === 'custom'" class="custom-date-inputs">
            <input type="date" v-model="customStartDate" class="date-input" />
            <span class="date-divider">~</span>
            <input type="date" v-model="customEndDate" class="date-input" />
          </div>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">카테고리</span>
        <div class="chip-group">
          <button
            class="chip"
            :class="{ active: selectedCategory === 'all' }"
            @click="handleCategoryClick('all')"
          >
            전체
          </button>
          <button
            v-for="cat in availableCategories"
            :key="cat"
            class="chip"
            :class="{ active: selectedCategory === cat }"
            @click="handleCategoryClick(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <div class="summary-cards">
      <div class="card income-card">
        <div class="card-label">수입</div>
        <div class="card-amount income">+{{ formatAmount(totalIncome) }}</div>
      </div>
      <div class="card expense-card">
        <div class="card-label">지출</div>
        <div class="card-amount expense">-{{ formatAmount(totalExpense) }}</div>
      </div>
    </div>

    <EditTransactionModal
      :show="editModalVisible"
      :transaction-id="editingId"
      @saved="onEditSaved"
      @cancel="editModalVisible = false"
    />

    <ConfirmModal
      :show="confirmModalVisible"
      message="정말 이 거래 내역을 삭제하시겠습니까?"
      @confirm="onConfirmDelete"
      @cancel="confirmModalVisible = false"
    />

    <div class="list-header">
      <span class="list-count">총 {{ sortedTransactions.length }}건</span>
      <select class="sort-select" v-model="sortKey">
        <option value="date-desc">날짜 최신순</option>
        <option value="date-asc">날짜 오래된순</option>
        <option value="amount-desc">금액 큰순</option>
        <option value="amount-asc">금액 작은순</option>
      </select>
    </div>

    <div class="transaction-list">
      <div
        v-for="item in pagedTransactions"
        :key="item.id"
        class="transaction-item"
      >
        <div class="item-left">
          <div class="item-icon" :class="item.type">
            {{ item.type === 'income' ? '↓' : '↑' }}
          </div>
          <div class="item-details">
            <div class="item-title">
              <span class="category-badge">{{ item.category }}</span>
              <span class="memo">{{ getMemoText(item) }}</span>
            </div>
            <div class="item-date">
              <span>{{ formatDate(item.date) }}</span>
              <span v-if="item.detailCategory">· {{ item.detailCategory }}</span>
            </div>
          </div>
        </div>

        <div class="item-right">
          <div class="amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-'
            }}{{ formatAmount(item.amount) }}원
          </div>
          <div class="item-actions">
            <button
              class="action-btn edit-btn"
              title="수정"
              @click="handleEdit(item.id)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </button>
            <button
              class="action-btn delete-btn"
              title="삭제"
              @click="handleDelete(item.id)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="sortedTransactions.length === 0" class="empty-state">
        해당하는 거래 내역이 없습니다.
      </div>

      <div v-if="hasMore" class="load-more">
        <button class="load-more-btn" @click="loadMore">
          더 보기 ({{ remaining }}건 남음)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/budgetStore';
import EditTransactionModal from '../components/EditTransactionModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const budgetStore = useBudgetStore();
const editModalVisible = ref(false);
const editingId = ref('');
const confirmModalVisible = ref(false);
const deletingId = ref('');
const sortKey = ref('date-desc');
const pageSize = ref(20);

const {
  filteredTransactions,
  selectedType,
  selectedCategory,
  selectedPeriod,
  availableCategories,
  customStartDate,
  customEndDate,
} = storeToRefs(budgetStore);

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
);

const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
);

const sortedTransactions = computed(() => {
  return [...filteredTransactions.value].sort((a, b) => {
    if (sortKey.value === 'date-desc') {
      return String(b.date ?? '').localeCompare(String(a.date ?? ''));
    } else if (sortKey.value === 'date-asc') {
      return String(a.date ?? '').localeCompare(String(b.date ?? ''));
    } else if (sortKey.value === 'amount-desc') {
      return Number(b.amount || 0) - Number(a.amount || 0);
    } else {
      return Number(a.amount || 0) - Number(b.amount || 0);
    }
  });
});

const pagedTransactions = computed(() => sortedTransactions.value.slice(0, pageSize.value));
const hasMore = computed(() => pageSize.value < sortedTransactions.value.length);
const remaining = computed(() => sortedTransactions.value.length - pageSize.value);

const loadMore = () => {
  pageSize.value += 20;
};

watch([sortKey, () => filteredTransactions.value], () => {
  pageSize.value = 20;
});

const formatAmount = (amount) => Number(amount || 0).toLocaleString();
const formatDate = (date) => (date ? date.replaceAll('-', '.') : '');
const getMemoText = (item) => item.memo || item.detailCategory || '메모 없음';

const handlePeriodClick = (value) => {
  selectedPeriod.value = value;
};

const handleCategoryClick = (value) => {
  selectedCategory.value = value;
};

const handleResetFilters = () => {
  selectedType.value = 'all';
  selectedPeriod.value = 'month';
  selectedCategory.value = 'all';
  customStartDate.value = '';
  customEndDate.value = '';
  sortKey.value = 'date-desc';
};

onMounted(() => {
  budgetStore.fetchTransactions();
});

const handleEdit = (id) => {
  editingId.value = id;
  editModalVisible.value = true;
};

const onEditSaved = async () => {
  editModalVisible.value = false;
  await budgetStore.fetchTransactions();
};

const handleDelete = (id) => {
  deletingId.value = id;
  confirmModalVisible.value = true;
};

const onConfirmDelete = async () => {
  confirmModalVisible.value = false;
  await budgetStore.deleteTransaction(deletingId.value);
  deletingId.value = '';
};
</script>

<style scoped>
.transaction-view {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.filters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.filters-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filters-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-bright);
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--text-muted);
  color: var(--text-bright);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-group-period {
  align-items: flex-start;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 60px;
}

.period-label {
  margin-top: 8px;
}

.period-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.toggle-group {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.toggle-btn.active {
  background: var(--text-bright);
  color: #1a1a1a;
}

.sort-arrow {
  font-size: 12px;
  font-weight: 700;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--text-muted);
}

.chip.active {
  background: var(--accent-bg, rgba(255, 255, 255, 0.1));
  border-color: var(--accent, #fff);
  color: var(--text-bright);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--card-bg, var(--bg));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
}

.card-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.card-amount {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.income {
  color: var(--income);
}

.expense {
  color: var(--expense);
}

.custom-date-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-divider {
  color: var(--text-muted);
}

.date-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-bright);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-count {
  font-size: 13px;
  color: var(--text-muted);
}

.sort-select {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 13px;
  font-family: var(--sans);
  padding: 6px 10px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}

.sort-select:focus {
  border-color: var(--accent);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.transaction-item:hover {
  border-color: var(--text-muted);
  transform: translateY(-2px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.item-icon.income {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.item-icon.expense {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.category-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.memo {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-bright);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-date {
  font-size: 12px;
  color: var(--text-muted);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.amount {
  font-size: 16px;
  font-weight: 600;
}

.amount.income {
  color: #4ade80;
}

.amount.expense {
  color: var(--text-bright);
}

.item-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-bright);
}

.action-btn.delete-btn:hover {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.load-more-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 13px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.load-more-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--text-muted);
  color: var(--text-bright);
}

@media (max-width: 860px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-label {
    min-width: auto;
  }

  .period-label {
    margin-top: 0;
  }

  .item-left,
  .item-right,
  .transaction-item {
    width: 100%;
  }

  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .item-right {
    justify-content: space-between;
  }

  .custom-date-inputs {
    flex-wrap: wrap;
  }
}
</style>
