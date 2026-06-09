<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import draggable from 'vuedraggable'
import Board from '@/components/Board.vue'
import Column from '@/components/Column.vue'
import Card from '@/components/Card.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import AddColumnModal from '@/components/AddColumnModal.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'
import EditColumnModal from '@/components/EditColumnModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useTaskStore } from '@/stores/task'
import { useColumnStore } from '@/stores/column'
import { useBoardStore } from '@/stores/board'
import { useBoardStorage, seedBoardData, getCurrentState, applyState } from '@/composables/useBoardStorage'
import { useSearch } from '@/composables/useSearch'
import { useHistory } from '@/composables/useHistory'
import type { Task, Column as ColumnType, DraggableChangeEvent } from '@/types'

const taskStore = useTaskStore()
const columnStore = useColumnStore()
const boardStore = useBoardStore()
const { loadState, isLoaded } = useBoardStorage()
const { isSearching, debouncedQuery, matchesTask } = useSearch()
const { canUndo, canRedo, record, undo, redo } = useHistory()

const isAddTaskModalOpen = ref(false)
const isAddColumnModalOpen = ref(false)
const activeColumnId = ref<string | null>(null)

const isEditTaskModalOpen = ref(false)
const isEditColumnModalOpen = ref(false)
const isConfirmDeleteModalOpen = ref(false)
const deleteMode = ref<'task' | 'column'>('task')
const activeTask = ref<Task | null>(null)
const activeColumn = ref<ColumnType | null>(null)

onMounted(() => {
  const loaded = loadState()
  if (!loaded) {
    seedBoardData()
  }
  isLoaded.value = true
  record(getCurrentState())
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function openAddTaskModal(columnId: string) {
  activeColumnId.value = columnId
  isAddTaskModalOpen.value = true
}

function openAddColumnModal() {
  isAddColumnModalOpen.value = true
}

function handleAddTask(title: string, description: string) {
  if (!activeColumnId.value) return

  const task = taskStore.addTask(activeColumnId.value, title, description)
  columnStore.addTaskToColumn(activeColumnId.value, task.id)
  isAddTaskModalOpen.value = false
  activeColumnId.value = null
  record(getCurrentState())
}

function openEditTaskModal(task: Task) {
  activeTask.value = task
  isEditTaskModalOpen.value = true
}

function handleSaveTask(title: string, description: string) {
  if (!activeTask.value) return
  taskStore.updateTask(activeTask.value.id, { title, description })
  isEditTaskModalOpen.value = false
  activeTask.value = null
  record(getCurrentState())
}

function handleRequestDelete() {
  isEditTaskModalOpen.value = false
  deleteMode.value = 'task'
  isConfirmDeleteModalOpen.value = true
}

function openEditColumnModal(column: ColumnType) {
  activeColumn.value = column
  isEditColumnModalOpen.value = true
}

function handleDeleteColumn(columnId: string) {
  activeColumnId.value = columnId
  deleteMode.value = 'column'
  isConfirmDeleteModalOpen.value = true
}

function handleSaveColumn(title: string) {
  if (!activeColumn.value) return
  columnStore.updateColumn(activeColumn.value.id, title)
  isEditColumnModalOpen.value = false
  activeColumn.value = null
  record(getCurrentState())
}

function performDeleteTask() {
  if (!activeTask.value) return
  const task = activeTask.value
  taskStore.removeTask(task.id)
  columnStore.removeTaskFromColumn(task.columnId, task.id)
}

function performDeleteColumn() {
  if (!activeColumnId.value) return

  const column = columnStore.columns.find(col => col.id === activeColumnId.value)
  if (!column) return

  column.taskIds.forEach(taskId => taskStore.removeTask(taskId))
  columnStore.removeColumn(activeColumnId.value)
}

function handleConfirmDelete() {
  if (deleteMode.value === 'task') {
    performDeleteTask()
  } else {
    performDeleteColumn()
  }

  handleCloseConfirmModal()
  record(getCurrentState())
}

function handleCloseAddModal() {
  isAddTaskModalOpen.value = false
  activeColumnId.value = null
}

function handleCloseAddColumnModal() {
  isAddColumnModalOpen.value = false
}

function handleCloseEditModal() {
  isEditTaskModalOpen.value = false
  activeTask.value = null
}

function handleCloseEditColumnModal() {
  isEditColumnModalOpen.value = false
  activeColumn.value = null
}

function handleCloseConfirmModal() {
  isConfirmDeleteModalOpen.value = false
  activeTask.value = null
  activeColumnId.value = null
}

function handleAddColumn(title: string) {
  columnStore.addColumn(title)
  isAddColumnModalOpen.value = false
  record(getCurrentState())
}

function handleTaskChange(columnId: string, event: DraggableChangeEvent<string>) {
  if (event.added) {
    taskStore.moveTask(event.added.element, columnId)
  }
  record(getCurrentState())
}

function handleUndo() {
  const state = undo()
  if (state) {
    applyState(state)
  }
}

function handleRedo() {
  const state = redo()
  if (state) {
    applyState(state)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) {
      handleRedo()
    } else {
      handleUndo()
    }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault()
    handleRedo()
  }
}

function getFilteredTaskIds(taskIds: string[]): string[] {
  if (!debouncedQuery.value) {
    return taskIds
  }

  return taskIds.filter((id) => {
    const task = taskStore.tasks[id]
    return task && matchesTask(task.title, task.description)
  })
}

function getFilteredCount(taskIds: string[]): number {
  return getFilteredTaskIds(taskIds).length
}

const deleteModalTitle = computed(() =>
  deleteMode.value === 'column' ? 'Удалить колонку?' : 'Удалить задачу?'
)

const deleteModalDescription = computed(() =>
  deleteMode.value === 'column'
    ? 'Вы уверены, что хотите удалить эту колонку? Все задачи в ней будут удалены. Это действие нельзя отменить.'
    : 'Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить.'
)

const deleteModalConfirmText = computed(() =>
  deleteMode.value === 'column' ? 'Удалить колонку' : 'Удалить'
)
</script>

<template>
  <Board
    :title="boardStore.title"
    :columns-count="columnStore.columns.length"
  >
    <template #header-actions>
      <button
        class="history-btn"
        :disabled="!canUndo"
        @click="handleUndo"
        data-tooltip="Отменить (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        class="history-btn"
        :disabled="!canRedo"
        @click="handleRedo"
        data-tooltip="Повторить (Ctrl+Y)"
      >
        ↷
      </button>
    </template>
    <Column
      v-for="column in columnStore.columns"
      :key="column.id"
      :column-id="column.id"
      :title="column.title"
      :count="isSearching ? getFilteredCount(column.taskIds) : column.taskIds.length"
      @add-task="openAddTaskModal(column.id)"
      @edit="openEditColumnModal(column)"
      @delete="handleDeleteColumn(column.id)"
    >
      <template #tasks>
        <div v-if="isSearching" class="draggable-list">
          <Card
            v-for="taskId in getFilteredTaskIds(column.taskIds)"
            :key="taskId"
            :task-id="taskId"
            :title="taskStore.tasks[taskId].title"
            :description="taskStore.tasks[taskId].description"
            @click="openEditTaskModal(taskStore.tasks[taskId])"
          />
          <div v-if="getFilteredTaskIds(column.taskIds).length === 0" class="column-empty">
            Нет совпадений
          </div>
        </div>
        <draggable
          v-else
          v-model="column.taskIds"
          class="draggable-list"
          group="tasks"
          :item-key="(id: string) => id"
          ghost-class="card--ghost"
          drag-class="card--dragging"
          @change="handleTaskChange(column.id, $event)"
        >
          <template #item="{ element: taskId }">
            <Card
              :task-id="taskId"
              :title="taskStore.tasks[taskId].title"
              :description="taskStore.tasks[taskId].description"
              @click="openEditTaskModal(taskStore.tasks[taskId])"
            />
          </template>
        </draggable>
      </template>
    </Column>

    <AddColumnButton @click="openAddColumnModal" />
  </Board>

  <AddColumnModal
    :open="isAddColumnModalOpen"
    @close="handleCloseAddColumnModal"
    @submit="handleAddColumn"
  />

  <AddTaskModal
    :open="isAddTaskModalOpen"
    @close="handleCloseAddModal"
    @submit="handleAddTask"
  />

  <EditTaskModal
    :open="isEditTaskModalOpen"
    :task="activeTask"
    @close="handleCloseEditModal"
    @save="handleSaveTask"
    @delete="handleRequestDelete"
  />

  <EditColumnModal
    :open="isEditColumnModalOpen"
    :column="activeColumn"
    @close="handleCloseEditColumnModal"
    @save="handleSaveColumn"
  />

  <ConfirmDeleteModal
    :open="isConfirmDeleteModalOpen"
    :title="deleteModalTitle"
    :description="deleteModalDescription"
    :confirm-text="deleteModalConfirmText"
    @close="handleCloseConfirmModal"
    @confirm="handleConfirmDelete"
  />
</template>

<style scoped lang="scss">
.history-btn {
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s, background 0.15s, opacity 0.15s;
  cursor: pointer;
}

.history-btn:hover:not(:disabled) {
  border-color: var(--color-border-hover);
  background: #f9fafb;
}

.history-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.history-btn[data-tooltip] {
  position: relative;
}

.history-btn[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.history-btn[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  top: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: #1f2937;
  pointer-events: none;
  z-index: 10;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-empty {
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 16px 8px;
}

:deep(.card--ghost) {
  opacity: 0.4;
  background: var(--color-surface);
  border: 2px dashed var(--color-accent);
  box-shadow: none;
}

:deep(.card--dragging) {
  opacity: 0.95;
  box-shadow: var(--shadow-lg);
  transform: rotate(2deg);
  cursor: grabbing;
}
</style>
