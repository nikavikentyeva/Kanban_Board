import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Task } from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks = reactive<Record<string, Task>>({})

  function addTask(columnId: string, title: string, description: string = ''): Task {
    const id = crypto.randomUUID()
    const task: Task = {
      id,
      columnId,
      title,
      description,
    };
    tasks[id] = task
    return task
  }

  function updateTask(taskId: string, updates: { title?: string; description?: string }) {
    const task = tasks[taskId]
    if (!task) return

    if (updates.title !== undefined) {
      task.title = updates.title
    }

    if (updates.description !== undefined) {
      task.description = updates.description
    }
  }

  function removeTask(taskId: string) {
    delete tasks[taskId]
  }

  function moveTask(taskId: string, newColumnId: string) {
    const task = tasks[taskId]
    if (task) {
      task.columnId = newColumnId
    }
  }

  function setTasks(newTasks: Record<string, Task>) {
    Object.keys(tasks).forEach((key) => {
      delete tasks[key]
    })
    Object.assign(tasks, newTasks)
  }

  function getTasksByIds(ids: string[]): Task[] {
    return ids.map((id) => tasks[id]).filter(Boolean)
  }

  return { tasks, addTask, updateTask, removeTask, moveTask, setTasks, getTasksByIds }
});
