<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
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
import { useBoardStorage, seedBoardData } from '@/composables/useBoardStorage'
import type { Task, Column as ColumnType, DraggableChangeEvent } from '@/types'

const taskStore = useTaskStore()
const columnStore = useColumnStore()
const boardStore = useBoardStore()
const { loadState, resetBoard, isLoaded } = useBoardStorage()

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
}

function handleTaskChange(columnId: string, event: DraggableChangeEvent<string>) {
  if (event.added) {
    taskStore.moveTask(event.added.element, columnId)
  }
}

function handleResetBoard() {
  if (confirm('Вы уверены, что хотите сбросить доску? Все изменения будут потеряны.')) {
    resetBoard()
  }
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
      <button class="reset-btn" @click="handleResetBoard">Сбросить доску</button>
    </template>
    <Column
      v-for="column in columnStore.columns"
      :key="column.id"
      :column-id="column.id"
      :title="column.title"
      :count="column.taskIds.length"
      @add-task="openAddTaskModal(column.id)"
      @edit="openEditColumnModal(column)"
      @delete="handleDeleteColumn(column.id)"
    >
      <template #tasks>
        <draggable
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
.reset-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
}

.reset-btn:hover {
  border-color: var(--color-border-hover);
  background: #f9fafb;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
