export interface Task {
  id: string
  columnId: string
  title: string
  description: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

export interface DraggableChangeEvent<T = unknown> {
  added?: {
    element: T
    newIndex: number
  }
  removed?: {
    element: T
    oldIndex: number
  }
  moved?: {
    element: T
    oldIndex: number
    newIndex: number
  }
}
