<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'

export interface AddTaskModalProps {
  open: boolean
}

const props = defineProps<AddTaskModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', title: string, description: string): void
}>()

const title = ref('')
const description = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = ''
      description.value = ''
    }
  }
)

function handleSubmit() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  emit('submit', trimmedTitle, description.value.trim())
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
    <h3 class="add-task-modal__title">Добавить задачу</h3>
    <form
      class="add-task-modal__form"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="title"
        type="text"
        placeholder="Название задачи"
        class="add-task-modal__input"
        autofocus
      />
      <textarea
        v-model="description"
        placeholder="Описание (необязательно)"
        class="add-task-modal__textarea"
        rows="3"
      />
      <div class="add-task-modal__actions">
        <button
          type="submit"
          class="add-task-modal__btn add-task-modal__btn--primary"
          :disabled="!title.trim()"
        >
          Добавить
        </button>
        <button type="button" class="add-task-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.add-task-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.add-task-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-task-modal__input,
.add-task-modal__textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  resize: none;
  background: var(--color-surface);

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
}

.add-task-modal__textarea {
  line-height: 1.5;
}

.add-task-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.add-task-modal__btn {
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
