<script setup lang="ts">
import Modal from '@/components/Modal.vue'

export interface ConfirmDeleteModalProps {
  open: boolean
}

defineProps<ConfirmDeleteModalProps>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <Modal :open="open" @close="handleClose">
    <h3 class="confirm-delete-modal__title">Удалить задачу?</h3>
    <p class="confirm-delete-modal__text">
      Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить.
    </p>
    <div class="confirm-delete-modal__actions">
      <button
        class="confirm-delete-modal__btn confirm-delete-modal__btn--danger"
        @click="handleConfirm"
      >
        Удалить
      </button>
      <button class="confirm-delete-modal__btn" @click="handleClose">
        Отмена
      </button>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.confirm-delete-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.confirm-delete-modal__text {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.confirm-delete-modal__actions {
  display: flex;
  gap: 10px;
}

.confirm-delete-modal__btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--color-border-hover);
    background: #f9fafb;
  }

  &--danger {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;

    &:hover {
      background: #dc2626;
      border-color: #dc2626;
    }
  }
}
</style>
