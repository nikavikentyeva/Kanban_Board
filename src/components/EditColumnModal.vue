<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import type { Column } from '@/types'

export interface EditColumnModalProps {
  open: boolean
  column: Column | null
}

export interface EditColumnModalEmits {
  close: []
  save: [title: string]
}

const props = defineProps<EditColumnModalProps>()
const emit = defineEmits<EditColumnModalEmits>()

const title = ref('')

watch(
  () => props.column,
  (column) => {
    if (column) {
      title.value = column.title
    }
  },
  { immediate: true }
)

function handleSave() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  emit('save', trimmedTitle)
}

function handleClose() {
  emit('close')
}

</script>

<template>
  <Modal :open="open" @close="handleClose">
    <h3 class="edit-column-modal__title">Редактировать колонку</h3>
    <form class="edit-column-modal__form" @submit.prevent="handleSave">
      <input
        v-model="title"
        type="text"
        placeholder="Название колонки"
        class="edit-column-modal__input"
      />
      <div class="edit-column-modal__actions">
        <button
          type="submit"
          class="edit-column-modal__btn edit-column-modal__btn--primary"
          :disabled="!title.trim()"
        >
          Сохранить
        </button>
        <button type="button" class="edit-column-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>

    </form>
  </Modal>
</template>

<style scoped lang="scss">
.edit-column-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.edit-column-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-column-modal__input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  background: var(--color-surface);

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
}

.edit-column-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.edit-column-modal__btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--color-border-hover);
    background: #f9fafb;
  }

  &--primary {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);

    &:hover:not(:disabled) {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &--danger {
    color: #ef4444;
    border-color: #ef4444;
    background: #fff;

    &:hover:not(:disabled) {
      background: #fee2e2;
    }
  }
}
</style>
