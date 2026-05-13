<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import type { Task } from '@/types'

export interface EditTaskModalProps {
  open: boolean
  task: Task | null
}

const props = defineProps<EditTaskModalProps>()

const emit = defineEmits<{
  close: []
  save: [title: string, description: string]
  delete: []
}>()

const title = ref('')
const description = ref('')

watch(
  () => props.task,
  (task) => {
    if (task) {
      title.value = task.title
      description.value = task.description
    }
  },
  { immediate: true }
)

function handleSave() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  emit('save', trimmedTitle, description.value.trim())
}

function handleClose() {
  emit('close')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <Modal :open="open" @close="handleClose">
    <h3 class="edit-task-modal__title">Редактировать задачу</h3>
    <form class="edit-task-modal__form" @submit.prevent="handleSave">
      <input
        v-model="title"
        type="text"
        placeholder="Название задачи"
        class="edit-task-modal__input"
      />
      <textarea
        v-model="description"
        placeholder="Описание (необязательно)"
        class="edit-task-modal__textarea"
        rows="3"
      />
      <div class="edit-task-modal__actions">
        <button
          type="submit"
          class="edit-task-modal__btn edit-task-modal__btn--primary"
          :disabled="!title.trim()"
        >
          Сохранить
        </button>
        <button type="button" class="edit-task-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>
      <div class="edit-task-modal__danger">
        <button type="button" class="edit-task-modal__btn edit-task-modal__btn--danger" @click="handleDelete">
          Удалить задачу
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.edit-task-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.edit-task-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-task-modal__input,
.edit-task-modal__textarea {
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

.edit-task-modal__textarea {
  line-height: 1.5;
}

.edit-task-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.edit-task-modal__danger {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.edit-task-modal__btn {
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
