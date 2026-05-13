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
