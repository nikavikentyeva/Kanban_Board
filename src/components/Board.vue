<script setup lang="ts">
export interface BoardProps {
  title: string
  columnsCount?: number
}

defineProps<BoardProps>()
</script>

<template>
  <div class="board">
    <div class="board__header">
      <h2 class="board__title">{{ title }}</h2>
      <span class="board__counter">{{ columnsCount }} колонки</span>
    </div>
    <div class="board__columns">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.board {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 20px 24px 12px;
    flex-shrink: 0;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__counter {
    font-size: 13px;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  &__columns {
    display: flex;
    gap: var(--gap);
    padding: 0 24px 24px;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: flex-start;
  }
}
</style>
