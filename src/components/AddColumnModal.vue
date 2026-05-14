<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'

export interface AddColumnModalProps {
  open: boolean
}

export interface AddColumnModalEmits {
  close: []
  submit: [title: string]
}

const props = defineProps<AddColumnModalProps>()
const emit = defineEmits<AddColumnModalEmits>()

const title = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = ''
    }
  }
)

function handleSubmit() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  emit('submit', trimmedTitle)
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Modal
    :open="open"
    @close="handleClose"
  >
    <h3 class="add-column-modal__title">Добавить колонку</h3>
    <form
      class="add-column-modal__form"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="title"
        type="text"
        placeholder="Название колонки"
        class="add-column-modal__input"
        autofocus
      />
      <div class="add-column-modal__actions">
        <button
          type="submit"
          class="add-column-modal__btn add-column-modal__btn--primary"
          :disabled="!title.trim()"
        >
          Добавить
        </button>
        <button type="button" class="add-column-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.add-column-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.add-column-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-column-modal__input {
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

.add-column-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.add-column-modal__btn {
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
}
</style>
