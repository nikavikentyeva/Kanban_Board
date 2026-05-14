<script setup lang="ts">
import BaseAddButton from '@/components/BaseAddButton.vue'

export interface AddColumnButtonEmits {
  click: []
}

const emit = defineEmits<AddColumnButtonEmits>()
</script>

<template>
  <BaseAddButton
    class="add-column"
    text="Добавить колонку"
    @click="emit('click')"
  />
</template>

<style scoped lang="scss">
.add-column {
  width: var(--column-width);
  flex-shrink: 0;
  justify-content: center;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
  font-size: 14px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
    background: #f9fafb;
  }

  :deep(.base-add-button__icon) {
    font-size: 18px;
  }

  :deep(.base-add-button__text) {
    font-size: 14px;
  }
}
</style>
