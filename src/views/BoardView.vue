<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Board from '@/components/Board.vue'
import Column from '@/components/Column.vue'
import Card from '@/components/Card.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useTaskStore } from '@/stores/task'
import { useColumnStore } from '@/stores/column'
import { useBoardStore } from '@/stores/board'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const columnStore = useColumnStore()
const boardStore = useBoardStore()

const isAddTaskModalOpen = ref(false)
const activeColumnId = ref<string | null>(null)

const isEditTaskModalOpen = ref(false)
const isConfirmDeleteModalOpen = ref(false)
const activeTask = ref<Task | null>(null)

onMounted(() => {
  const seedColumns = [
    { id: 'col-1', title: 'Сделать', taskIds: [] as string[] },
    { id: 'col-2', title: 'В процессе', taskIds: [] as string[] },
    { id: 'col-3', title: 'Готово', taskIds: [] as string[] },
  ]

  const seedTasks = [
    { columnId: 'col-1', title: 'Добавить авторизацию', description: 'Реализовать вход через OAuth' },
    { columnId: 'col-1', title: 'Настроить CI/CD', description: '' },
    { columnId: 'col-2', title: 'Верстка Kanban-доски', description: '' },
  ]

  columnStore.setColumns(seedColumns)
  seedTasks.forEach((task) => {
    const created = taskStore.addTask(task.columnId, task.title, task.description)
    columnStore.addTaskToColumn(task.columnId, created.id)
  })
})

function openAddTaskModal(columnId: string) {
  activeColumnId.value = columnId
  isAddTaskModalOpen.value = true
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
  isConfirmDeleteModalOpen.value = true
}

function handleConfirmDelete() {
  if (!activeTask.value) return
  taskStore.removeTask(activeTask.value.id)
  columnStore.removeTaskFromColumn(activeTask.value.columnId, activeTask.value.id)
  isConfirmDeleteModalOpen.value = false
  activeTask.value = null
}

function handleCloseAddModal() {
  isAddTaskModalOpen.value = false
  activeColumnId.value = null
}

function handleCloseEditModal() {
  isEditTaskModalOpen.value = false
  activeTask.value = null
}

function handleCloseConfirmModal() {
  isConfirmDeleteModalOpen.value = false
  activeTask.value = null
}
</script>

<template>
  <Board
    :title="boardStore.title"
    :columns-count="columnStore.columns.length"
  >
    <Column
      v-for="column in columnStore.columns"
      :key="column.id"
      :column-id="column.id"
      :title="column.title"
      :count="column.taskIds.length"
      @add-task="openAddTaskModal(column.id)"
    >
      <Card
        v-for="task in taskStore.getTasksByIds(column.taskIds)"
        :key="task.id"
        :task-id="task.id"
        :title="task.title"
        :description="task.description"
        @click="openEditTaskModal(task)"
      />
    </Column>

    <AddColumnButton @click="" />
  </Board>

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

  <ConfirmDeleteModal
    :open="isConfirmDeleteModalOpen"
    @close="handleCloseConfirmModal"
    @confirm="handleConfirmDelete"
  />
</template>

<style scoped lang="scss">

</style>
