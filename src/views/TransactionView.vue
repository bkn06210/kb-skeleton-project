<template>
  <div class="transaction-view">
    <!-- 필터 영역 -->
    <div class="filters-section">
      <!-- 타입 -->
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

      <!-- 기간 -->
      <div class="filter-group" style="align-items: flex-start">
        <span class="filter-label" style="margin-top: 8px">기간</span>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
          <div class="chip-group">
            <button class="chip" :class="{ active: selectedPeriod === 'all' }" @click="selectedPeriod = 'all'">전체</button>
            <button class="chip" :class="{ active: selectedPeriod === 'month' }" @click="selectedPeriod = 'month'">이번 달</button>
            <button class="chip" :class="{ active: selectedPeriod === 'week' }" @click="selectedPeriod = 'week'">이번 주</button>
            <button class="chip" :class="{ active: selectedPeriod === 'custom' }" @click="selectedPeriod = 'custom'">직접 설정</button>
          </div>
          <div v-if="selectedPeriod === 'custom'" class="custom-date-inputs">
            <input type="date" v-model="customStartDate" class="date-input" />
            <span style="color: var(--text-muted)">~</span>
            <input type="date" v-model="customEndDate" class="date-input" />
          </div>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="filter-group">
        <span class="filter-label">카테고리</span>
        <div class="chip-group">
          <button class="chip" :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">전체</button>
          <button
            v-for="cat in availableCategories"
            :key="cat"
            class="chip"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >{{ cat }}</button>
        </div>
      </div>

      <!-- 정렬 -->
      <div class="filter-group">
        <span class="filter-label">정렬</span>
        <div class="chip-group">
          <button class="chip" :class="{ active: selectedSort === 'newest' }" @click="selectedSort = 'newest'">최신순</button>
          <button class="chip" :class="{ active: selectedSort === 'oldest' }" @click="selectedSort = 'oldest'">오래된 순</button>
          <button class="chip" :class="{ active: selectedSort === 'amountDesc' }" @click="selectedSort = 'amountDesc'">금액 높은 순</button>
          <button class="chip" :class="{ active: selectedSort === 'amountAsc' }" @click="selectedSort = 'amountAsc'">금액 낮은 순</button>
        </div>
      </div>
    </div>

    <!-- 거래 목록 -->
    <div class="list-header">
      <span class="list-count">총 {{ filteredTransactions.length }}건</span>
    </div>

    <div class="transaction-list">
      <div
        v-for="item in filteredTransactions"
        :key="item.id"
        class="transaction-item"
      >
        <div class="item-left">
          <div class="item-icon" :class="item.type">
            <svg v-if="item.type === 'expense'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
          <div class="item-details">
            <div class="item-title">
              <span class="category-badge">{{ item.category }}</span>
              <span class="memo">{{ item.detailCategory || item.memo || '-' }}</span>
            </div>
            <div class="item-date">{{ item.date }}</div>
          </div>
        </div>
        <div class="item-right">
          <div class="amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원
          </div>
          <div class="item-actions">
            <button class="action-btn" title="수정" @click="handleEdit(item.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button class="action-btn delete-btn" title="삭제" @click="handleDelete(item.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredTransactions.length === 0" class="empty">
        해당하는 거래 내역이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const budgetStore = useBudgetStore();

const filteredTransactions = computed(() => budgetStore.filteredTransactions);
const availableCategories = computed(() => budgetStore.availableCategories);

const selectedType = computed({ get: () => budgetStore.selectedType, set: (v) => (budgetStore.selectedType = v) });
const selectedCategory = computed({ get: () => budgetStore.selectedCategory, set: (v) => (budgetStore.selectedCategory = v) });
const selectedPeriod = computed({ get: () => budgetStore.selectedPeriod, set: (v) => (budgetStore.selectedPeriod = v) });
const selectedSort = computed({ get: () => budgetStore.selectedSort, set: (v) => (budgetStore.selectedSort = v) });
const customStartDate = computed({ get: () => budgetStore.customStartDate, set: (v) => (budgetStore.customStartDate = v) });
const customEndDate = computed({ get: () => budgetStore.customEndDate, set: (v) => (budgetStore.customEndDate = v) });

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
  gap: 16px;
  height: 100%;
}

/* 필터 */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--card-bg);
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 56px;
  letter-spacing: 0.3px;
}
.toggle-group {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}
.toggle-btn {
  background: transparent;
  border: none;
  color: var(--text);
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.toggle-btn.active {
  background: var(--text-bright);
  color: #1e293b;
}
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.chip:hover {
  border-color: var(--text-muted);
  color: var(--text-bright);
}
.chip.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  color: #93c5fd;
}

/* 날짜 입력 */
.custom-date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-bright);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}
::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

/* 목록 헤더 */
.list-header {
  display: flex;
  align-items: center;
  padding: 0 4px;
}
.list-count {
  font-size: 12px;
  color: var(--text-muted);
}

/* 거래 목록 */
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: border-color 0.15s, transform 0.15s;
}
.transaction-item:hover {
  border-color: rgba(148, 163, 184, 0.3);
  transform: translateY(-1px);
}
.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.item-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.item-icon.income {
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
}
.item-icon.expense {
  background: rgba(248, 113, 113, 0.12);
  color: #fca5a5;
}
.item-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-badge {
  font-size: 11px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: var(--text-muted);
  white-space: nowrap;
}
.memo {
  font-size: 14px;
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
  gap: 14px;
  flex-shrink: 0;
}
.amount {
  font-size: 15px;
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}
.amount.income {
  color: #86efac;
}
.amount.expense {
  color: #fca5a5;
}
.item-actions {
  display: flex;
  gap: 5px;
}
.action-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-bright);
}
.action-btn.delete-btn:hover {
  background: rgba(248, 113, 113, 0.12);
  color: #fca5a5;
  border-color: rgba(248, 113, 113, 0.3);
}
.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
}
</style>
