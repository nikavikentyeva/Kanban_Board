import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Column } from '@/types'

export const useColumnStore = defineStore('column', () => {
  const columns = ref<Column[]>([])

  function setColumns(newColumns: Column[]) {
    columns.value = newColumns
  }

  function addTaskToColumn(columnId: string, taskId: string) {
    const column = columns.value.find((col) => col.id === columnId)
    if (column) {
      column.taskIds.push(taskId)
    }
  }

  function removeTaskFromColumn(columnId: string, taskId: string) {
    const column = columns.value.find((col) => col.id === columnId)
    if (column) {
      column.taskIds = column.taskIds.filter((id) => id !== taskId)
    }
  }

  function addColumn(title: string): Column {
    const id = crypto.randomUUID()
    const column: Column = { id, title, taskIds: [] }
    columns.value.push(column)
    return column
  }

  function removeColumn(columnId: string) {
    columns.value = columns.value.filter((col) => col.id !== columnId)
  }

  function updateColumn(columnId: string, title: string) {
    const column = columns.value.find((col) => col.id === columnId)
    if (column) {
      column.title = title
    }
  }

  return { columns, setColumns, addTaskToColumn, removeTaskFromColumn, addColumn, removeColumn, updateColumn }
});
