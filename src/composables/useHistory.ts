import { ref, computed } from 'vue'
import type { BoardState } from './useBoardStorage'

const MAX_HISTORY = 20

const past = ref<BoardState[]>([])
const future = ref<BoardState[]>([])

export function useHistory() {
  const canUndo = computed(() => past.value.length > 1)
  const canRedo = computed(() => future.value.length > 0)

  function record(state: BoardState) {
    const last = past.value[past.value.length - 1]

    if (last && JSON.stringify(last) === JSON.stringify(state)) {
      return
    }

    if (past.value.length >= MAX_HISTORY) {
      past.value.shift()
    }

    past.value.push(JSON.parse(JSON.stringify(state)))
    future.value = []
  }

  function undo(): BoardState | null {
    if (!canUndo.value) {
      return null
    }

    const currentState = past.value[past.value.length - 1]
    future.value.push(JSON.parse(JSON.stringify(currentState)))
    past.value.pop()

    return JSON.parse(JSON.stringify(past.value[past.value.length - 1]))
  }

  function redo(): BoardState | null {
    if (!canRedo.value) {
      return null
    }

    const state = future.value.pop()!
    past.value.push(JSON.parse(JSON.stringify(state)))

    return JSON.parse(JSON.stringify(state))
  }

  function clear() {
    past.value = []
    future.value = []
  }

  return { canUndo, canRedo, record, undo, redo, clear }
}
