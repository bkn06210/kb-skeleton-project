<template>
  <nav class="sidebar">
    <div class="logo">⊞ 티끌모아태산</div>
    <RouterLink to="/">Dashboard</RouterLink>
    <RouterLink to="/transactions">Transactions</RouterLink>
    <RouterLink to="/add">Add new</RouterLink>
    <RouterLink to="/settings">Settings</RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
