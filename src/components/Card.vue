<script setup lang="ts">

export interface CardProps {
  title: string
  description?: string
}

defineProps<CardProps>()
</script>

<template>
  <div class="card">
    <p class="card__title">{{ title }}</p>
    <p class="card__description">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-md);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-text-primary);
    word-break: break-word;
  }

  &__description {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-top: 4px;
    line-height: 1.4;
    word-break: break-word;
  }

  &--empty {
    background: transparent;
    border-style: dashed;
    text-align: center;
    cursor: default;
    &:hover {
      box-shadow: none;
      border-color: var(--color-border);
    }
  }

  &__placeholder {
    font-size: 13px;
    color: var(--color-text-muted);
  }
}
</style>
