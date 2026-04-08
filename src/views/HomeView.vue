<template>
  <div class="dashboard">
    <div class="summary-cards">
      <div class="card income-card">
        <div class="card-label">총수입</div>
        <div class="card-amount income">+{{ formatAmount(totalIncome) }}</div>
      </div>
      <div class="card expense-card">
        <div class="card-label">총지출</div>
        <div class="card-amount expense">-{{ formatAmount(totalExpense) }}</div>
      </div>
      <div class="card balance-card">
        <div class="card-label">최종 금액</div>
        <div class="card-amount balance">{{ formatAmount(netBalance) }}</div>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">최근 거래내역</span>
          <RouterLink to="/transactions" class="view-all">전체 보기</RouterLink>
        </div>
        <div class="transaction-list">
          <div
            v-for="tx in recentTransactions"
            :key="tx.id"
            class="transaction-item"
          >
            <div class="tx-icon" :class="tx.type">
              <svg
                v-if="tx.type === 'expense'"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              <svg
                v-else
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
            <div class="tx-info">
              <div class="tx-category">{{ tx.category }}</div>
              <div class="tx-memo">{{ tx.memo }}</div>
            </div>
            <div class="tx-right">
              <div class="tx-amount" :class="tx.type">
                {{ tx.type === 'expense' ? '-' : '+'
                }}{{ formatAmount(tx.amount) }}
              </div>
              <div class="tx-date">{{ formatDate(tx.date) }}</div>
            </div>
          </div>
          <div v-if="recentTransactions.length === 0" class="empty">
            최근 거래내역이 없습니다.
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">카테고리별 지출</span>
        </div>
        <div class="category-bar" v-if="expenseByCategory.length > 0">
          <div
            v-for="(cat, i) in expenseByCategory"
            :key="cat.name"
            class="bar-segment"
            :style="{
              width: cat.ratio + '%',
              background: COLORS[i % COLORS.length],
            }"
          />
        </div>
        <div class="category-legend">
          <div
            v-for="(cat, i) in expenseByCategory"
            :key="cat.name"
            class="legend-item"
          >
            <span
              class="legend-dot"
              :style="{ background: COLORS[i % COLORS.length] }"
            />
            <span class="legend-name">{{ cat.name }}</span>
            <span class="legend-amount">{{ formatAmount(cat.total) }}</span>
          </div>
          <div v-if="expenseByCategory.length === 0" class="empty">
            지출 내역이 없습니다.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/budgetStore';
import { useMonthStore } from '../stores/monthStore';

const COLORS = [
  '#ef4444',
  '#3b82f6',
  '#f59e0b',
  '#22c55e',
  '#a855f7',
  '#ec4899',
];

const budgetStore = useBudgetStore();
const monthStore = useMonthStore();
const { transactions: budgetList } = storeToRefs(budgetStore);
const load = () => budgetStore.fetchTransactions();

onMounted(load);
watch(() => monthStore.yyyyMM, load);

const totalIncome = computed(() =>
  budgetList.value
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0),
);

const totalExpense = computed(() =>
  budgetList.value
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0),
);

const netBalance = computed(() => totalIncome.value - totalExpense.value);

const recentTransactions = computed(() =>
  [...budgetList.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5),
);

const expenseByCategory = computed(() => {
  const map = {};
  budgetList.value
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amt]) => ({
      name,
      total: amt,
      ratio: total ? (amt / total) * 100 : 0,
    }));
});

const formatAmount = (n) => Number(n).toLocaleString();
const formatDate = (d) => d?.slice(5).replace('-', '.') ?? '';
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
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
.balance {
  color: var(--balance);
}

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-bright);
}

.view-all {
  font-size: 12px;
  color: var(--accent);
}

.view-all:hover {
  text-decoration: underline;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.transaction-item:last-child {
  border-bottom: none;
}

.tx-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tx-icon.expense {
  background: rgba(239, 68, 68, 0.15);
  color: var(--expense);
}
.tx-icon.income {
  background: rgba(59, 130, 246, 0.15);
  color: var(--income);
}

.tx-info {
  flex: 1;
  overflow: hidden;
}

.tx-category {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-bright);
}

.tx-memo {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-right {
  text-align: right;
  flex-shrink: 0;
}

.tx-amount {
  font-size: 13px;
  font-weight: 600;
}
.tx-date {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.category-bar {
  display: flex;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
  margin-bottom: 16px;
}

.bar-segment {
  border-radius: 3px;
  transition: width 0.3s;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.legend-item:last-child {
  border-bottom: none;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 13px;
  color: var(--text);
}
.legend-amount {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-bright);
}

.empty {
  font-size: 13px;
  color: var(--text-muted);
  padding: 16px 0;
  text-align: center;
}
</style>
