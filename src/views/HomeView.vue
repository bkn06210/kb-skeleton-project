<template>
  <div class="dashboard">
    <div class="summary-cards">
      <div class="card income-card">
        <div class="card-label">이번 달 수입</div>
        <div class="card-amount income">+{{ formatAmount(totalIncome) }}</div>
        <div class="card-sub">{{ monthStore.label }}</div>
      </div>
      <div class="card expense-card">
        <div class="card-label">이번 달 지출</div>
        <div class="card-amount expense">-{{ formatAmount(totalExpense) }}</div>
        <div class="card-sub">{{ monthStore.label }}</div>
      </div>
      <div class="card net-card">
        <div class="card-label">이번 달 손익</div>
        <div class="card-amount" :class="netBalance >= 0 ? 'income' : 'expense'">
          {{ netBalance >= 0 ? '+' : '-' }}{{ formatAmount(Math.abs(netBalance)) }}
        </div>
        <div class="card-sub">수입 - 지출</div>
      </div>
    </div>

    <div class="panel budget-panel">
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="panel-title">월 예산 현황</span>
        </div>
        <RouterLink to="/settings" class="view-all">예산 설정</RouterLink>
      </div>

      <div v-if="hasBudget" class="budget-overview">
        <div class="budget-copy">
          <div class="budget-heading">
            <strong>{{ monthStore.label }} 예산</strong>
            <span class="budget-rate">{{ Math.round(budgetUsageRate) }}%</span>
          </div>
          <div class="budget-progress">
            <div
              class="budget-progress-value"
              :style="{ width: `${budgetUsageRate}%` }"
            />
          </div>
          <div class="budget-caption">
            <span>전체 예산 {{ formatAmount(totalBudget) }}</span>
            <span>사용 금액 {{ formatAmount(totalExpense) }}</span>
            <span
              :class="budgetRemaining >= 0 ? 'budget-positive' : 'budget-over'"
            >
              {{
                budgetRemaining >= 0
                  ? `${formatAmount(budgetRemaining)} 남음`
                  : `${formatAmount(Math.abs(budgetRemaining))} 초과`
              }}
            </span>
          </div>
        </div>

        <div class="budget-summary">
          <div class="budget-stat">
            <span class="budget-stat-label">예산</span>
            <strong>{{ formatAmount(totalBudget) }}</strong>
          </div>
          <div class="budget-stat">
            <span class="budget-stat-label">지출</span>
            <strong>{{ formatAmount(totalExpense) }}</strong>
          </div>
          <div class="budget-stat">
            <span class="budget-stat-label">남은 예산</span>
            <strong
              :class="budgetRemaining >= 0 ? 'budget-positive' : 'budget-over'"
            >
              {{
                (budgetRemaining < 0 ? '-' : '') +
                formatAmount(Math.abs(budgetRemaining))
              }}
            </strong>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        아직 월 예산이 없어요. 설정에서 예산을 추가하면 지출 진행률을 볼 수
        있어요.
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="panel-title">최근 거래 내역</span>
            <span class="panel-caption">최근 5일</span>
          </div>
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
              <div class="tx-memo">{{ getTransactionDescription(tx) }}</div>
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
            최근 5일 거래 내역이 없어요.
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="panel-title">카테고리별 지출</span>
            <span class="panel-caption">이번 달 기준</span>
          </div>
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
            이번 달 지출 데이터가 없어요.
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
import { useMonthlyBudgetStore } from '../stores/monthlyBudgetStore';

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
const monthlyBudgetStore = useMonthlyBudgetStore();

const { transactions } = storeToRefs(budgetStore);
const { currentBudget } = storeToRefs(monthlyBudgetStore);

const load = async () => {
  await Promise.all([
    budgetStore.fetchTransactions(),
    monthlyBudgetStore.fetchMonthlyBudgetByMonth(monthStore.yyyyMM),
  ]);
};

onMounted(load);
watch(() => monthStore.yyyyMM, load);

const monthTransactions = computed(() =>
  transactions.value.filter((transaction) =>
    String(transaction.date ?? '').startsWith(monthStore.yyyyMM),
  ),
);

const totalIncome = computed(() =>
  monthTransactions.value
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
);

const totalExpense = computed(() =>
  monthTransactions.value
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
);

const netBalance = computed(() => totalIncome.value - totalExpense.value);
const totalBudget = computed(() => Number(currentBudget.value?.total) || 0);
const budgetRemaining = computed(() => totalBudget.value - totalExpense.value);
const budgetUsageRate = computed(() => {
  if (!totalBudget.value) return 0;
  return Math.min(100, (totalExpense.value / totalBudget.value) * 100);
});

const padNumber = (value) => String(value).padStart(2, '0');
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  return `${year}-${month}-${day}`;
};

const recentTransactionEndKey = computed(() => {
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${padNumber(today.getMonth() + 1)}`;

  if (monthStore.yyyyMM === currentMonthKey) {
    return formatDateKey(today);
  }

  const lastDateOfMonth = new Date(monthStore.year, monthStore.month, 0);
  return formatDateKey(lastDateOfMonth);
});

const recentTransactionStartKey = computed(() => {
  const endDate = new Date(`${recentTransactionEndKey.value}T00:00:00`);
  endDate.setDate(endDate.getDate() - 4);
  return formatDateKey(endDate);
});

const recentTransactions = computed(() =>
  [...monthTransactions.value]
    .filter((transaction) => {
      const dateKey = String(transaction.date ?? '');
      return (
        dateKey >= recentTransactionStartKey.value &&
        dateKey <= recentTransactionEndKey.value
      );
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date))),
);

const expenseByCategory = computed(() => {
  const expenseMap = {};

  monthTransactions.value
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      expenseMap[transaction.category] =
        (expenseMap[transaction.category] || 0) +
        Number(transaction.amount || 0);
    });

  const total = Object.values(expenseMap).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  return Object.entries(expenseMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      total: amount,
      ratio: total ? (amount / total) * 100 : 0,
    }));
});

const hasBudget = computed(() => totalBudget.value > 0);

const formatAmount = (value) => Number(value || 0).toLocaleString();
const formatDate = (date) => date?.slice(5).replace('-', '.') ?? '';
const getTransactionDescription = (transaction) =>
  transaction.memo || transaction.detailCategory || '상세 메모 없음';
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px 28px;
}

.income-card {
  border-left: 3px solid var(--income);
}

.expense-card {
  border-left: 3px solid var(--expense);
}

.net-card {
  border-left: 3px solid var(--accent);
}

.card-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.card-amount {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.card-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.income {
  color: var(--income);
}

.expense {
  color: var(--expense);
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
}

.budget-panel {
  background:
    radial-gradient(
      circle at top right,
      rgba(96, 165, 250, 0.12),
      transparent 28%
    ),
    linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent 60%),
    var(--card-bg);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-bright);
}

.panel-caption {
  font-size: 12px;
  color: var(--text-muted);
}

.view-all {
  font-size: 12px;
  color: var(--accent);
}

.view-all:hover {
  text-decoration: underline;
}

.budget-overview {
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.28);
  padding: 18px;
}

.budget-copy {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.budget-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: var(--text-bright);
}

.budget-rate {
  font-size: 13px;
  font-weight: 700;
  color: #93c5fd;
}

.budget-progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.18);
}

.budget-progress-value {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
}

.budget-caption {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-size: 12px;
  color: var(--text-muted);
}

.budget-positive {
  color: #86efac;
}

.budget-over {
  color: #fca5a5;
}

.budget-summary {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.budget-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.budget-stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
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

@media (max-width: 1080px) {
  .summary-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .summary-cards,
  .budget-summary {
    grid-template-columns: 1fr;
  }

  .panel-header,
  .budget-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
