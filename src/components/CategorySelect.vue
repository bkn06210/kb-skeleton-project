<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="">카테고리 선택</option>
    <option v-for="cat in categories" :key="cat.id" :value="cat.name">
      {{ cat.name }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: String,
  categories: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['update:modelValue']);
</script>
