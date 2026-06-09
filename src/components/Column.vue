<script setup lang="ts">
import BaseAddButton from '@/components/BaseAddButton.vue'

export interface ColumnProps {
  columnId: string
  title: string
  count?: number
}

export interface ColumnEmits {
  'add-task': []
  edit: []
  delete: []
}

defineProps<ColumnProps>()
const emit = defineEmits<ColumnEmits>()
</script>

<template>
  <div class="column">
    <div class="column__header">
      <div class="column__info">
        <span class="column__title">{{ title }}</span>
        <span
          v-if="count !== undefined"
          class="column__count"
        >
          {{ count }}
        </span>
      </div>
      <div class="column__actions">
        <button
          class="column__action-btn"
          title="Редактировать"
          @click.stop="emit('edit')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button
          class="column__action-btn column__action-btn--danger"
          title="Удалить"
          @click.stop="emit('delete')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
    <div class="column__tasks">
      <slot name="tasks" />
    </div>
    <div class="column__footer">
      <BaseAddButton
        text="Добавить задачу"
        @click="emit('add-task')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.column {
  width: var(--column-width);
  flex-shrink: 0;
  background: #f5f5f5;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  max-height: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;

    @media (max-width: 640px) {
      padding: 10px 12px 8px;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__count {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    background: #e5e7eb;
    padding: 2px 8px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover &__actions {
    opacity: 1;
  }

  &__action-btn {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    background: transparent;
    transition: color 0.15s, background 0.15s;
    cursor: pointer;

    &:hover {
      background: #e5e7eb;
      color: var(--color-text-primary);
    }

    &--danger:hover {
      color: var(--color-danger);
      background: #fee2e2;
    }
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px 12px;
    overflow-y: auto;
    flex: 1;

    @media (max-width: 640px) {
      padding: 0 8px 8px;
    }
  }

  &__footer {
    padding: 0 12px 12px;

    @media (max-width: 640px) {
      padding: 0 8px 8px;
    }
  }
}
</style>
