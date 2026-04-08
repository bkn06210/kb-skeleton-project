<template>
  <div class="layout">
    <SideBar />
    <div class="main">
      <TopBar />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
import TopBar from './components/TopBar.vue';
</script>
