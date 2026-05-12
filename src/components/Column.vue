<script setup lang="ts">
import BaseAddButton from '@/components/BaseAddButton.vue'

export interface ColumnProps {
  title: string
  count?: number
}

type ColumnEmits = (e: 'add-task') => void

defineProps<ColumnProps>()

const emit = defineEmits<ColumnEmits>()
</script>

<template>
  <div class="column">
    <div class="column__header">
      <span class="column__title">{{ title }}</span>
      <span v-if="count !== undefined" class="column__count">{{ count }}</span>
    </div>
    <div class="column__tasks">
      <slot />
    </div>
    <div class="column__footer">
      <BaseAddButton text="Добавить задачу" @click="emit('add-task')" />
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
  }

  &__tasks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px 12px;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 0 12px 12px;
  }
}
</style>
