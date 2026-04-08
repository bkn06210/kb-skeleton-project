<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <div class="month-nav">
        <button class="month-btn" @click="monthStore.prev()">&#60;</button>
        <span class="month-label">{{ monthStore.label }}</span>
        <button class="month-btn" @click="monthStore.next()">&#62;</button>
      </div>
    </div>

    <div class="topbar-right">
      <button class="icon-btn" @click="$router.push('/add')" title="Add transaction">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button class="icon-btn" @click="$router.push('/settings')" title="Profile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMonthStore } from '../stores/monthStore';

const route = useRoute();
const monthStore = useMonthStore();

const titleMap = {
  home: 'Dashboard',
  transactions: 'Transactions',
  add: 'Add transaction',
  settings: 'Settings',
};

const pageTitle = computed(() => titleMap[route.name] ?? 'My wallet');
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  height: 60px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-bright);
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.month-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 2px 6px;
  font-size: 14px;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.month-btn:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.month-label {
  font-size: 14px;
  color: var(--text);
  min-width: 64px;
  text-align: center;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.icon-btn:hover {
  color: var(--text-bright);
  border-color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
}
</style>
