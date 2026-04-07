<template>
  <div class="layout">
    <nav class="sidebar">
      <div class="logo">⊞ My wallet</div>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/transactions">Transactions</RouterLink>
      <RouterLink to="/add">Add new</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
