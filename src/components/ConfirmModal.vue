<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="modal-buttons">
        <button @click="$emit('confirm')">확인</button>
        <button @click="$emit('cancel')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: {
    type: String,
    default: '정말 삭제하시겠습니까?',
  },
});

defineEmits(['confirm', 'cancel']);
</script>
