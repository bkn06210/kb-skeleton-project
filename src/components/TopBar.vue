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
      <button
        class="icon-btn"
        @click="$router.push('/settings')"
        title="setting"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
      </button>
      <button
        class="icon-btn"
        @click="$router.push('/profile')"
        title="Profile"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
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
  profile: 'Profile',
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
  transition:
    color 0.15s,
    background 0.15s;
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
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;
}

.icon-btn:hover {
  color: var(--text-bright);
  border-color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
}
</style>
