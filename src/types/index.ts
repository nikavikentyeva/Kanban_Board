export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

export type ColumnId = Column['id'];
export type TaskId = Task['id'];
export type BoardId = Board['id'];
