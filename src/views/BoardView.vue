<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Board from '@/components/Board.vue'
import Column from '@/components/Column.vue'
import Card from '@/components/Card.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'
import { useTaskStore } from '@/stores/task'
import { useColumnStore } from '@/stores/column'
import { useBoardStore } from '@/stores/board'

const taskStore = useTaskStore()
const columnStore = useColumnStore()
const boardStore = useBoardStore()

const isAddTaskModalOpen = ref(false)
const activeColumnId = ref<string | null>(null)

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

function handleCloseModal() {
  isAddTaskModalOpen.value = false
  activeColumnId.value = null
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
        :title="task.title"
        :description="task.description"
      />
    </Column>

    <AddColumnButton @click="" />
  </Board>

  <AddTaskModal
    :open="isAddTaskModalOpen"
    @close="handleCloseModal"
    @submit="handleAddTask"
  />
</template>

<style scoped lang="scss">

</style>
