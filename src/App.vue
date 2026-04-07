<template>
  <div class="layout">
    <SideBar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
</script>
