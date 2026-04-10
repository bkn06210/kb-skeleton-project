<template>
  <div class="layout">
    <SideBar />
    <div class="main">
      <TopBar />
      <main class="content">
        <RouterView />
      </main>
      <ToastNotification />
      <button class="fab" @click="$router.push('/add')" title="Add transaction">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
import TopBar from './components/TopBar.vue';
import ToastNotification from './components/ToastNotification.vue';
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transition: background 0.15s, transform 0.15s;
  z-index: 100;
}

.fab:hover {
  background: #2563eb;
  transform: scale(1.08);
}
</style>
