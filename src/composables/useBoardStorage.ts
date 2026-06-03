import { ref, watch, onMounted } from 'vue'
import { useBoardStore } from '@/stores/board'
import { useColumnStore } from '@/stores/column'
import { useTaskStore } from '@/stores/task'
import type { Column, Task } from '@/types'

const STORAGE_KEY = 'kanban-board-state'

export interface BoardState {
  board: { title: string }
  columns: Column[]
  tasks: Record<string, Task>
}

export function getCurrentState(): BoardState {
  const boardStore = useBoardStore()
  const columnStore = useColumnStore()
  const taskStore = useTaskStore()

  return {
    board: { title: boardStore.title },
    columns: JSON.parse(JSON.stringify(columnStore.columns)),
    tasks: JSON.parse(JSON.stringify(taskStore.tasks)),
  }
}

export function applyState(state: BoardState) {
  const boardStore = useBoardStore()
  const columnStore = useColumnStore()
  const taskStore = useTaskStore()

  boardStore.setTitle(state.board.title)
  columnStore.setColumns(JSON.parse(JSON.stringify(state.columns)))
  taskStore.setTasks(JSON.parse(JSON.stringify(state.tasks)))
}

export function seedBoardData() {
  const columnStore = useColumnStore()
  const taskStore = useTaskStore()
  const boardStore = useBoardStore()

  boardStore.setTitle('Моя доска')

  const seedColumns: Column[] = [
    { id: 'col-1', title: 'Сделать', taskIds: [] },
    { id: 'col-2', title: 'В процессе', taskIds: [] },
    { id: 'col-3', title: 'Готово', taskIds: [] },
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
}

export function useBoardStorage() {
  const boardStore = useBoardStore()
  const columnStore = useColumnStore()
  const taskStore = useTaskStore()

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const isLoaded = ref(false)

  function saveState() {
    const state: BoardState = {
      board: { title: boardStore.title },
      columns: columnStore.columns,
      tasks: taskStore.tasks,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to save kanban state to localStorage', e)
    }
  }

  function debouncedSave(delay = 500) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      saveState()
    }, delay)
  }

  function loadState(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false

      const state: BoardState = JSON.parse(raw)

      if (state.board?.title) {
        boardStore.setTitle(state.board.title)
      }

      if (Array.isArray(state.columns)) {
        columnStore.setColumns(state.columns)
      }

      if (state.tasks && typeof state.tasks === 'object') {
        taskStore.setTasks(state.tasks)
      }

      return true
    } catch (e) {
      console.warn('Failed to load kanban state from localStorage', e)
      return false
    }
  }

  function resetBoard() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // ignore
    }
    taskStore.setTasks({})
    seedBoardData()
    saveState()
  }

  onMounted(() => {
    watch(
      () => [boardStore.title, columnStore.columns, taskStore.tasks],
      () => {
        if (isLoaded.value) {
          debouncedSave()
        }
      },
      { deep: true }
    )
  })

  return {
    saveState,
    loadState,
    resetBoard,
    isLoaded,
  }
}
