<script setup lang="ts">
import { provide, ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import AddTaskGlobalModal from '@/components/AddTaskGlobalModal.vue'
import { provideSearch, SearchKey } from '@/composables/useSearch'
import { useBoardStore } from '@/stores/board'
import { useColumnStore } from '@/stores/column'
import { useTaskStore } from '@/stores/task'
import { seedBoardData, getCurrentState } from '@/composables/useBoardStorage'
import { useHistory } from '@/composables/useHistory'

const search = provideSearch()
provide(SearchKey, search)

const { searchQuery, clearQuery } = search

const boardStore = useBoardStore()
const columnStore = useColumnStore()
const taskStore = useTaskStore()
const { record } = useHistory()

const isSettingsOpen = ref(false)
const isAddTaskOpen = ref(false)

function openSettings() {
  isSettingsOpen.value = true
}

function closeSettings() {
  isSettingsOpen.value = false
}

function handleSaveSettings(title: string) {
  boardStore.setTitle(title)
  record(getCurrentState())
  closeSettings()
}

function handleResetBoard() {
  record(getCurrentState())
  localStorage.removeItem('kanban-board-state')
  taskStore.setTasks({})
  seedBoardData()
  record(getCurrentState())
  closeSettings()
}

function openAddTask() {
  isAddTaskOpen.value = true
}

function closeAddTask() {
  isAddTaskOpen.value = false
}

function handleAddTask(title: string, description: string, columnId: string) {
  const task = taskStore.addTask(columnId, title, description)
  columnStore.addTaskToColumn(columnId, task.id)
  record(getCurrentState())
  closeAddTask()
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header__inner">
        <div class="app-header__logo">
          <span class="app-header__icon">◼</span>
          <h1 class="app-header__title">Kanban Board</h1>
        </div>

        <div class="app-header__search">
          <SearchInput v-model="searchQuery" @clear="clearQuery" />
        </div>

        <div class="app-header__actions">
          <button class="app-header__btn" @click="openSettings">Настройки</button>
          <button class="app-header__btn app-header__btn--primary" @click="openAddTask">Новая задача</button>
        </div>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>

    <SettingsModal
      :open="isSettingsOpen"
      :board-title="boardStore.title"
      @close="closeSettings"
      @save="handleSaveSettings"
      @reset="handleResetBoard"
    />

    <AddTaskGlobalModal
      :open="isAddTaskOpen"
      :columns="columnStore.columns"
      @close="closeAddTask"
      @submit="handleAddTask"
    />
  </div>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    padding: 0 12px;
  }
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  gap: 16px;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.app-header__icon {
  font-size: 18px;
  color: var(--color-accent);
}

.app-header__title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    display: none;
  }
}

.app-header__search {
  flex: 1;
  max-width: 360px;

  @media (max-width: 640px) {
    max-width: none;
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    gap: 6px;
  }
}

.app-header__btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 640px) {
    padding: 5px 10px;
    font-size: 12px;
  }
}

.app-header__btn:hover {
  border-color: var(--color-border-hover);
  background: #f9fafb;
}

.app-header__btn--primary {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.app-header__btn--primary:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.app-main {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
