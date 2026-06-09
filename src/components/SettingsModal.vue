<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'

export interface SettingsModalProps {
  open: boolean
  boardTitle: string
}

export interface SettingsModalEmits {
  close: []
  save: [title: string]
  reset: []
}

const props = defineProps<SettingsModalProps>()
const emit = defineEmits<SettingsModalEmits>()

const title = ref('')

watch(
  () => props.boardTitle,
  (newTitle) => {
    title.value = newTitle
  },
  { immediate: true }
)

function handleSave() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  emit('save', trimmedTitle)
}

function handleReset() {
  if (confirm('Вы уверены, что хотите сбросить доску? Все изменения будут потеряны.')) {
    emit('reset')
  }
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
    <h3 class="settings-modal__title">Настройки доски</h3>
    <form
      class="settings-modal__form"
      @submit.prevent="handleSave"
    >
      <label class="settings-modal__label">
        <span class="settings-modal__label-text">Название доски</span>
        <input
          v-model="title"
          type="text"
          placeholder="Название доски"
          class="settings-modal__input"
        />
      </label>

      <div class="settings-modal__actions">
        <button
          type="submit"
          class="settings-modal__btn settings-modal__btn--primary"
          :disabled="!title.trim()"
        >
          Сохранить
        </button>
        <button type="button" class="settings-modal__btn" @click="handleClose">
          Отмена
        </button>
      </div>

      <div class="settings-modal__danger">
        <button
          type="button"
          class="settings-modal__btn settings-modal__btn--danger"
          @click="handleReset"
        >
          Сбросить доску
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.settings-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.settings-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-modal__label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-modal__label-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.settings-modal__input {
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

.settings-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.settings-modal__danger {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.settings-modal__btn {
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
