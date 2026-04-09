<template>
  <div class="transaction-view">
<<<<<<< HEAD
    <!-- 필터 영역 -->
    <div class="filters-section">
      <!-- 타입 -->
      <div class="filter-group">
        <span class="filter-label">타입</span>
        <div class="toggle-group">
          <button class="toggle-btn" :class="{ active: selectedType === 'all' }" @click="selectedType = 'all'">전체</button>
          <button class="toggle-btn" :class="{ active: selectedType === 'income' }" @click="selectedType = 'income'">수입</button>
          <button class="toggle-btn" :class="{ active: selectedType === 'expense' }" @click="selectedType = 'expense'">지출</button>
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
=======
    <section class="filters-section">
      <div class="filters-header">
        <div>
          <p class="filters-eyebrow">Amount sort</p>
          <h2 class="filters-title">거래내역</h2>
        </div>
        <div class="filters-actions">
          <div class="sort-pill">
            <span class="sort-pill-label">정렬</span>
            <strong>{{ sortLabel }}</strong>
          </div>
          <button class="reset-btn" @click="handleResetFilters">초기화</button>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">타입</span>
        <div class="toggle-group">
          <button
            class="toggle-btn type-all"
            :class="{ active: selectedType === 'all' }"
            @click="handleTypeClick('all')"
          >
            <span>전체</span>
            <span v-if="selectedType === 'all'" class="sort-arrow">
              {{ sortArrow }}
            </span>
          </button>
          <button
            class="toggle-btn type-income"
            :class="{ active: selectedType === 'income' }"
            @click="handleTypeClick('income')"
          >
            <span>수입</span>
            <span v-if="selectedType === 'income'" class="sort-arrow">
              {{ sortArrow }}
            </span>
          </button>
          <button
            class="toggle-btn type-expense"
            :class="{ active: selectedType === 'expense' }"
            @click="handleTypeClick('expense')"
          >
            <span>지출</span>
            <span v-if="selectedType === 'expense'" class="sort-arrow">
              {{ sortArrow }}
            </span>
          </button>
        </div>
      </div>

      <div class="filter-group filter-group-period">
        <span class="filter-label">기간</span>
        <div class="filter-stack">
          <div class="chip-group">
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'month' }"
              @click="handlePeriodClick('month')"
            >
              <span>이번 달</span>
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'week' }"
              @click="handlePeriodClick('week')"
            >
              <span>최근 7일</span>
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'custom' }"
              @click="handlePeriodClick('custom')"
            >
              <span>직접 설정</span>
            </button>
            <button
              class="chip"
              :class="{ active: selectedPeriod === 'all' }"
              @click="handlePeriodClick('all')"
            >
              <span>전체</span>
            </button>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
          </div>
          <div v-if="selectedPeriod === 'custom'" class="custom-date-inputs">
            <input type="date" v-model="customStartDate" class="date-input" />
            <span class="date-divider">~</span>
            <input type="date" v-model="customEndDate" class="date-input" />
          </div>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="filter-group">
        <span class="filter-label">카테고리</span>
        <div class="chip-group">
<<<<<<< HEAD
          <button class="chip" :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">전체</button>
=======
          <button
            class="chip category-chip"
            :class="{ active: selectedCategory === 'all' }"
            @click="handleCategoryClick('all')"
          >
            <span>전체</span>
          </button>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
          <button
            v-for="cat in availableCategories"
            :key="cat"
            class="chip category-chip"
            :class="{ active: selectedCategory === cat }"
<<<<<<< HEAD
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
=======
            :style="getCategoryStyle(cat)"
            @click="handleCategoryClick(cat)"
          >
            <span class="chip-icon">{{ getCategoryMeta(cat).icon }}</span>
            <span>{{ cat }}</span>
          </button>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
        </div>
      </div>
    </section>

    <section class="results-summary">
      <div class="summary-chip">
        <span class="summary-chip-label">결과</span>
        <strong>{{ sortedTransactions.length }}건</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-chip-label">정렬</span>
        <strong>{{ sortLabel }}</strong>
      </div>
      <div v-if="selectedCategory !== 'all'" class="summary-chip">
        <span class="chip-icon">{{
          getCategoryMeta(selectedCategory).icon
        }}</span>
        <strong>{{ selectedCategory }}</strong>
      </div>
    </section>

    <!-- 목록 헤더 -->
    <div class="list-header">
      <span class="list-count">총 {{ filteredTransactions.length }}건</span>
    </div>

    <!-- 거래 목록 -->
    <div class="transaction-list">
      <article
        v-for="item in sortedTransactions"
        :key="item.id"
        class="transaction-item"
        :style="getCategoryStyle(item.category, item.type)"
      >
        <div class="item-left">
<<<<<<< HEAD
          <div class="item-icon" :class="item.type">
            <svg v-if="item.type === 'expense'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
=======
          <div
            class="item-icon"
            :style="getCategoryStyle(item.category, item.type)"
          >
            {{ getCategoryMeta(item.category, item.type).icon }}
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
          </div>

          <div class="item-details">
            <div class="item-title">
<<<<<<< HEAD
              <span class="category-badge">{{ item.category }}</span>
              <span class="memo">{{ item.detailCategory || item.memo || '-' }}</span>
=======
              <span
                class="category-badge"
                :style="getCategoryStyle(item.category, item.type)"
              >
                <span class="chip-icon">{{
                  getCategoryMeta(item.category, item.type).icon
                }}</span>
                <span>{{ item.category }}</span>
              </span>
              <span class="type-badge" :class="item.type">
                {{ item.type === 'income' ? '수입' : '지출' }}
              </span>
            </div>

            <div class="memo">{{ getMemoText(item) }}</div>
            <div class="item-meta">
              <span>{{ formatDate(item.date) }}</span>
              <span v-if="item.detailCategory">{{ item.detailCategory }}</span>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
            </div>
          </div>
        </div>

        <div class="item-right">
          <div class="amount" :class="item.type">
<<<<<<< HEAD
            {{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원
=======
            {{ item.type === 'income' ? '+' : '-'
            }}{{ formatAmount(item.amount) }}원
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
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
<<<<<<< HEAD
      </div>

      <div v-if="filteredTransactions.length === 0" class="empty">
        해당하는 거래 내역이 없습니다.
=======
      </article>

      <div v-if="sortedTransactions.length === 0" class="empty-state">
        <div class="empty-icon">🧾</div>
        <strong>조건에 맞는 거래가 없어요.</strong>
        <span>필터를 바꾸거나 새로운 거래를 추가해 보세요.</span>
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
      </div>
    </div>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { onMounted, computed } from 'vue';
=======
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
import { useBudgetStore } from '../stores/budgetStore';
import { useRouter } from 'vue-router';

const CATEGORY_META = {
  식비: { icon: '🍚', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.18)' },
  교통비: { icon: '🚌', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.16)' },
  쇼핑: { icon: '🛍️', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.16)' },
  공과금: { icon: '💡', color: '#facc15', bg: 'rgba(250, 204, 21, 0.16)' },
  취미: { icon: '🎧', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.16)' },
  의료: { icon: '💊', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.16)' },
  기타: { icon: '📦', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.16)' },
  월급: { icon: '💼', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.16)' },
  용돈: { icon: '🎁', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)' },
  이자: { icon: '🏦', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.16)' },
  부수입: { icon: '✨', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.16)' },
};

const router = useRouter();
const budgetStore = useBudgetStore();
const sortOrder = ref('desc');

const filteredTransactions = computed(() => budgetStore.filteredTransactions);
const availableCategories = computed(() => budgetStore.availableCategories);

const selectedType = computed({ get: () => budgetStore.selectedType, set: (v) => (budgetStore.selectedType = v) });
const selectedCategory = computed({ get: () => budgetStore.selectedCategory, set: (v) => (budgetStore.selectedCategory = v) });
const selectedPeriod = computed({ get: () => budgetStore.selectedPeriod, set: (v) => (budgetStore.selectedPeriod = v) });
const selectedSort = computed({ get: () => budgetStore.selectedSort, set: (v) => (budgetStore.selectedSort = v) });
const customStartDate = computed({ get: () => budgetStore.customStartDate, set: (v) => (budgetStore.customStartDate = v) });
const customEndDate = computed({ get: () => budgetStore.customEndDate, set: (v) => (budgetStore.customEndDate = v) });

const sortArrow = computed(() => (sortOrder.value === 'desc' ? '↓' : '↑'));
const sortLabel = computed(() =>
  sortOrder.value === 'desc' ? '큰 금액순' : '작은 금액순',
);

const sortedTransactions = computed(() => {
  return [...filteredTransactions.value].sort((a, b) => {
    const amountDiff = Number(b.amount) - Number(a.amount);
    if (amountDiff !== 0) {
      return sortOrder.value === 'desc' ? amountDiff : -amountDiff;
    }

    return String(b.date ?? '').localeCompare(String(a.date ?? ''));
  });
});

const getCategoryMeta = (category, type = 'expense') => {
  if (CATEGORY_META[category]) {
    return CATEGORY_META[category];
  }

  if (type === 'income') {
    return { icon: '💰', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.16)' };
  }

  return { icon: '🧾', color: '#f87171', bg: 'rgba(248, 113, 113, 0.16)' };
};

const getCategoryStyle = (category, type = 'expense') => {
  const meta = getCategoryMeta(category, type);
  return {
    '--category-color': meta.color,
    '--category-bg': meta.bg,
  };
};

const getMemoText = (item) => item.memo || item.detailCategory || '메모 없음';
const formatAmount = (amount) => Number(amount || 0).toLocaleString();
const formatDate = (date) => (date ? date.replaceAll('-', '.') : '');

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
};

const applyFilter = (targetRef, value) => {
  if (targetRef.value === value) {
    toggleSortOrder();
    return;
  }

  targetRef.value = value;
  sortOrder.value = 'desc';
};

const handleTypeClick = (value) => applyFilter(selectedType, value);
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
  sortOrder.value = 'desc';
};

onMounted(() => {
  budgetStore.fetchTransactions();
});

const handleEdit = (id) => {
  router.push(`/add?id=${id}`);
};

const handleDelete = async (id) => {
  if (confirm('정말 이 거래 내역을 삭제하시겠습니까?')) {
    await budgetStore.deleteTransaction(id);
  }
};
</script>

<style scoped>
.transaction-view {
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  gap: 16px;
  height: 100%;
}

/* 필터 */
=======
  gap: 20px;
  min-height: 100%;
}

>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
.filters-section {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  gap: 14px;
  background: var(--card-bg);
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
=======
  gap: 18px;
  padding: 22px;
  border-radius: 20px;
  border: 1px solid rgba(96, 165, 250, 0.18);
  background:
    radial-gradient(
      circle at top right,
      rgba(56, 189, 248, 0.16),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.16),
      rgba(15, 17, 23, 0.96) 58%
    ),
    var(--card-bg);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.filters-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.filters-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(125, 211, 252, 0.85);
  margin-bottom: 6px;
}

.filters-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-bright);
}

.sort-pill,
.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.48);
  color: var(--text-bright);
  backdrop-filter: blur(8px);
}

.sort-pill-label,
.summary-chip-label {
  font-size: 12px;
  color: rgba(226, 232, 240, 0.72);
}

.reset-btn {
  min-height: 40px;
  border: 1px solid rgba(191, 219, 254, 0.24);
  border-radius: 999px;
  padding: 9px 14px;
  color: var(--text-bright);
  background: rgba(255, 255, 255, 0.06);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.reset-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(191, 219, 254, 0.42);
  background: rgba(59, 130, 246, 0.16);
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
<<<<<<< HEAD
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 56px;
  letter-spacing: 0.3px;
=======
  min-width: 64px;
  padding-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(226, 232, 240, 0.78);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.filter-stack {
  display: flex;
<<<<<<< HEAD
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
=======
  flex-direction: column;
  gap: 12px;
  width: 100%;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.toggle-group,
.chip-group {
  display: flex;
  flex-wrap: wrap;
<<<<<<< HEAD
  gap: 6px;
=======
  gap: 10px;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.toggle-group {
  padding: 6px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.42);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.toggle-btn,
.chip {
<<<<<<< HEAD
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
=======
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  background: rgba(255, 255, 255, 0.03);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.toggle-btn:hover,
.chip:hover {
<<<<<<< HEAD
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
=======
  transform: translateY(-1px);
  border-color: rgba(191, 219, 254, 0.32);
  color: var(--text-bright);
}

.toggle-btn.active,
.chip.active {
  color: var(--text-bright);
  border-color: rgba(191, 219, 254, 0.35);
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.22);
}

.toggle-btn.type-all.active,
.chip.active {
  background: rgba(59, 130, 246, 0.18);
}

.toggle-btn.type-income.active {
  background: rgba(59, 130, 246, 0.22);
  color: #dbeafe;
}

.toggle-btn.type-expense.active {
  background: rgba(239, 68, 68, 0.2);
  color: #fee2e2;
}

.category-chip.active {
  background: var(--category-bg, rgba(59, 130, 246, 0.18));
  color: var(--category-color, var(--text-bright));
  border-color: var(--category-color, rgba(191, 219, 254, 0.35));
}

.chip-icon {
  font-size: 15px;
  line-height: 1;
}

.sort-arrow {
  font-size: 12px;
  font-weight: 800;
  opacity: 0.9;
}

.custom-date-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-input {
  min-width: 156px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text-bright);
  background: rgba(15, 23, 42, 0.52);
  outline: none;
}

.date-divider {
  color: var(--text-muted);
}

.results-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
<<<<<<< HEAD
  background: var(--card-bg);
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: border-color 0.15s, transform 0.15s;
=======
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 60%),
    var(--card-bg);
  box-shadow:
    inset 4px 0 0 var(--category-color),
    0 14px 32px rgba(15, 23, 42, 0.18);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.transaction-item:hover {
<<<<<<< HEAD
  border-color: rgba(148, 163, 184, 0.3);
  transform: translateY(-1px);
=======
  transform: translateY(-2px);
  border-color: rgba(191, 219, 254, 0.24);
  box-shadow:
    inset 4px 0 0 var(--category-color),
    0 18px 36px rgba(15, 23, 42, 0.24);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
<<<<<<< HEAD
=======
  min-width: 0;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.item-icon {
<<<<<<< HEAD
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
=======
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--category-bg);
  color: var(--category-color);
  font-size: 24px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.item-details {
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  gap: 3px;
=======
  gap: 6px;
  min-width: 0;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge,
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}

.category-badge {
<<<<<<< HEAD
  font-size: 11px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: var(--text-muted);
  white-space: nowrap;
=======
  background: var(--category-bg);
  color: var(--category-color);
}

.type-badge {
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.type-badge.income {
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.14);
}

.type-badge.expense {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.14);
}

.memo {
<<<<<<< HEAD
  font-size: 14px;
  font-weight: 500;
=======
  font-size: 16px;
  font-weight: 600;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
  color: var(--text-bright);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.item-meta span + span::before {
  content: '•';
  margin-right: 8px;
  color: rgba(148, 163, 184, 0.58);
}

.item-right {
  display: flex;
  align-items: center;
<<<<<<< HEAD
  gap: 14px;
=======
  gap: 16px;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
  flex-shrink: 0;
}

.amount {
<<<<<<< HEAD
  font-size: 15px;
  font-weight: 600;
  min-width: 100px;
  text-align: right;
=======
  min-width: 110px;
  text-align: right;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.amount.income {
<<<<<<< HEAD
  color: #86efac;
=======
  color: #60a5fa;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.amount.expense {
  color: #fca5a5;
}

.item-actions {
  display: flex;
<<<<<<< HEAD
  gap: 5px;
=======
  gap: 8px;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.action-btn {
<<<<<<< HEAD
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
=======
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.03);
  transition:
    transform 0.18s ease,
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

.action-btn:hover {
<<<<<<< HEAD
  background: rgba(255, 255, 255, 0.07);
=======
  transform: translateY(-1px);
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
  color: var(--text-bright);
  background: rgba(255, 255, 255, 0.06);
}
<<<<<<< HEAD
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
=======

.delete-btn:hover {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.14);
  border-color: rgba(248, 113, 113, 0.28);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  border-radius: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.22);
  background:
    radial-gradient(circle at top, rgba(96, 165, 250, 0.12), transparent 55%),
    rgba(15, 23, 42, 0.32);
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 32px;
}

::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
>>>>>>> f764497f84db2c35dddb55cb59f7f0c93768ded7
}

@media (max-width: 860px) {
  .filters-header,
  .filter-group,
  .transaction-item,
  .item-right {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-label {
    min-width: 0;
    padding-top: 0;
  }

  .item-right {
    gap: 12px;
  }

  .amount {
    min-width: 0;
    text-align: left;
  }

  .item-actions {
    justify-content: flex-end;
  }
}
</style>
