<template>
  <div class="transaction-view">
    <div class="filters-section">
      <div class="filter-group">
        <span class="filter-label">타입</span>
        <div class="toggle-group">
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'all' }"
            @click="selectedType = 'all'"
          >
            전체
          </button>
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'income' }"
            @click="selectedType = 'income'"
          >
            수입
          </button>
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'expense' }"
            @click="selectedType = 'expense'"
          >
            지출
          </button>
        </div>
      </div>

      <div class="filter-group" style="align-items: flex-start">
        <span class="filter-label" style="margin-top: 8px">기간</span>
        <div
          style="display: flex; flex-direction: column; gap: 12px; width: 100%"
        >
          <div class="chip-group">
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'month' }"
              @click="selectedPeriod = 'month'"
            >
              이번 달
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'week' }"
              @click="selectedPeriod = 'week'"
            >
              이번 주
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'custom' }"
              @click="selectedPeriod = 'custom'"
            >
              직접 설정
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'all' }"
              @click="selectedPeriod = 'all'"
            >
              전체
            </button>
          </div>

          <div v-if="selectedPeriod === 'custom'" class="custom-date-inputs">
            <input type="date" v-model="customStartDate" class="date-input" />
            <span style="color: var(--text-muted)">~</span>
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
            @click="selectedCategory = 'all'"
          >
            전체
          </button>
          <button
            v-for="cat in availableCategories"
            :key="cat"
            class="chip"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <div class="transaction-list">
      <div
        v-for="item in filteredTransactions"
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
              <span class="memo">{{ item.memo }}</span>
            </div>
            <div class="item-date">{{ item.date }}</div>
          </div>
        </div>
        <div class="item-right">
          <div class="amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-'
            }}{{ item.amount.toLocaleString() }}원
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
      <div
        v-if="filteredTransactions.length === 0"
        class="text-center p-4 text-muted"
      >
        해당하는 거래 내역이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/budgetStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const budgetStore = useBudgetStore();

const {
  filteredTransactions,
  selectedType,
  selectedCategory,
  selectedPeriod,
  availableCategories,
  customStartDate,
  customEndDate,
} = storeToRefs(budgetStore);

onMounted(() => {
  budgetStore.fetchTransactions();
});

const handleEdit = (id) => {
  router.push(`/add?id=${id}`);
};

const handleDelete = async (id) => {
  if (confirm('정말 이 내역을 삭제하시겠습니까?')) {
    await budgetStore.deleteTransaction(id);
  }
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
.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 60px;
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
}
.toggle-btn.active {
  background: var(--text-bright);
  color: #1a1a1a;
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
}
.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
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
}
.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-muted);
}
.memo {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-bright);
}
.item-date {
  font-size: 12px;
  color: var(--text-muted);
}
.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
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
.text-center {
  text-align: center;
}
.text-muted {
  color: var(--text-muted);
}
.p-4 {
  padding: 1.5rem;
}
.custom-date-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>
