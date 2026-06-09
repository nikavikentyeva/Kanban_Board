<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import type { Column } from '@/types'

export interface AddTaskGlobalModalProps {
  open: boolean
  columns: Column[]
}

export interface AddTaskGlobalModalEmits {
  close: []
  submit: [title: string, description: string, columnId: string]
}

const props = defineProps<AddTaskGlobalModalProps>()
const emit = defineEmits<AddTaskGlobalModalEmits>()

const title = ref('')
const description = ref('')
const selectedColumnId = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = ''
      description.value = ''
      selectedColumnId.value = props.columns[0]?.id ?? ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle || !selectedColumnId.value) return

  emit('submit', trimmedTitle, description.value.trim(), selectedColumnId.value)
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
    <h3 class="add-task-global-modal__title">Новая задача</h3>
    <form
      class="add-task-global-modal__form"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="title"
        type="text"
        placeholder="Название задачи"
        class="add-task-global-modal__input"
      />
      <textarea
        v-model="description"
        placeholder="Описание (необязательно)"
        class="add-task-global-modal__textarea"
        rows="3"
      />
      <label class="add-task-global-modal__label">
        <span class="add-task-global-modal__label-text">Колонка</span>
        <select
          v-model="selectedColumnId"
          class="add-task-global-modal__select"
        >
          <option
            v-for="column in columns"
            :key="column.id"
            :value="column.id"
          >
            {{ column.title }}
          </option>
        </select>
      </label>
      <div class="add-task-global-modal__actions">
        <button
          type="submit"
          class="add-task-global-modal__btn add-task-global-modal__btn--primary"
          :disabled="!title.trim() || !selectedColumnId"
        >
          Создать
        </button>
        <button type="button" class="add-task-global-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.add-task-global-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.add-task-global-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-task-global-modal__input,
.add-task-global-modal__textarea,
.add-task-global-modal__select {
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

.add-task-global-modal__textarea {
  resize: none;
  line-height: 1.5;
}

.add-task-global-modal__select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 36px;
}

.add-task-global-modal__label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.add-task-global-modal__label-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.add-task-global-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.add-task-global-modal__btn {
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
