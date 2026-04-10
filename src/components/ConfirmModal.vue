<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <p class="modal-message">{{ message }}</p>
      <div class="modal-buttons">
        <button class="btn btn-confirm" @click="$emit('confirm')">확인</button>
        <button class="btn btn-cancel" @click="$emit('cancel')">취소</button>
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

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 32px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-message {
  font-size: 15px;
  color: var(--text-bright);
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--sans);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn-confirm {
  background: rgba(248, 113, 113, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
}

.btn-confirm:hover {
  background: rgba(248, 113, 113, 0.25);
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-cancel:hover {
  color: var(--text);
  border-color: var(--text-muted);
}
</style>
