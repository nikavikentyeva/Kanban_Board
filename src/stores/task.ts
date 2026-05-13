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

  function getTasksByIds(ids: string[]): Task[] {
    return ids.map((id) => tasks[id]).filter(Boolean)
  }

  return { tasks, addTask, getTasksByIds }
});
