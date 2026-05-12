<script setup lang="ts">
export interface BaseAddButtonProps {
  text: string
}

type BaseAddButtonEmits = (e: 'click') => void

defineProps<BaseAddButtonProps>()

const emit = defineEmits<BaseAddButtonEmits>()
</script>

<template>
  <button class="base-add-button" @click="emit('click')">
    <span class="base-add-button__icon">+</span>
    <span class="base-add-button__text">{{ text }}</span>
  </button>
</template>

<style scoped lang="scss">
.base-add-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #e5e7eb;
    color: var(--color-text-primary);
  }

  &__icon {
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
  }

  &__text {
    font-size: 13px;
  }
}
</style>
