<script setup lang="ts">
import { computed } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useTaskStore } from '@/stores/task'
import { pluralize } from '@/utils/pluralize'

export interface BoardProps {
  title: string
  columnsCount?: number
}

defineProps<BoardProps>()

const { isSearching, debouncedQuery } = useSearch()
const taskStore = useTaskStore()

const searchCount = computed(() => {
  if (!debouncedQuery.value) {
    return 0
  }

  return Object.values(taskStore.tasks).filter(
    (task) =>
      task.title.toLowerCase().includes(debouncedQuery.value) ||
      task.description.toLowerCase().includes(debouncedQuery.value)
  ).length
})
</script>

<template>
  <div class="board">
    <div class="board__header">
      <div class="board__header-left">
        <h2 class="board__title">{{ title }}</h2>
        <span v-if="isSearching" class="board__counter">
          Найдено: {{ searchCount }} {{ pluralize(searchCount, 'task') }}
        </span>
        <span v-else class="board__counter">{{ columnsCount }} {{ pluralize(columnsCount ?? 0, 'column') }}</span>
      </div>
      <div class="board__header-actions">
        <slot name="header-actions" />
      </div>
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
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 24px 12px;
    flex-shrink: 0;

    @media (max-width: 640px) {
      flex-wrap: wrap;
      padding: 12px 12px 8px;
      gap: 8px;
    }
  }

  &__header-left {
    display: flex;
    align-items: baseline;
    gap: 12px;

    @media (max-width: 640px) {
      gap: 8px;
    }
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      gap: 6px;
    }
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

    @media (max-width: 640px) {
      padding: 0 12px 12px;
    }
  }
}
</style>
