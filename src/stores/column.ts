import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Column } from '@/types'

export const useColumnStore = defineStore('column', () => {
  const columns = ref<Column[]>([])

  function setColumns(newColumns: Column[]) {
    columns.value = newColumns
  }

  function addTaskToColumn(columnId: string, taskId: string) {
    const column = columns.value.find((c) => c.id === columnId)
    if (column) {
      column.taskIds.push(taskId)
    }
  }

  return { columns, setColumns, addTaskToColumn }
});
