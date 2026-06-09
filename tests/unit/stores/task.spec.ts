import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '@/stores/task'

describe('task store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a task with generated id', () => {
    const store = useTaskStore()
    const task = store.addTask('col-1', 'Test task', 'Description')

    expect(task.id).toBeDefined()
    expect(task.columnId).toBe('col-1')
    expect(task.title).toBe('Test task')
    expect(task.description).toBe('Description')
    expect(store.tasks[task.id]).toEqual(task)
  })

  it('generates unique ids for each task', () => {
    const store = useTaskStore()
    const taskA = store.addTask('col-1', 'A')
    const taskB = store.addTask('col-1', 'B')

    expect(taskA.id).not.toBe(taskB.id)
  })

  it('updates task title and description', () => {
    const store = useTaskStore()
    const task = store.addTask('col-1', 'Old title', 'Old desc')

    store.updateTask(task.id, { title: 'New title', description: 'New desc' })

    expect(store.tasks[task.id].title).toBe('New title')
    expect(store.tasks[task.id].description).toBe('New desc')
  })

  it('ignores update for non-existing task', () => {
    const store = useTaskStore()
    store.updateTask('non-existing', { title: 'New' })
    expect(Object.keys(store.tasks)).toHaveLength(0)
  })

  it('removes a task', () => {
    const store = useTaskStore()
    const task = store.addTask('col-1', 'To remove')

    store.removeTask(task.id)

    expect(store.tasks[task.id]).toBeUndefined()
  })

  it('moves task to another column', () => {
    const store = useTaskStore()
    const task = store.addTask('col-1', 'Move me')

    store.moveTask(task.id, 'col-2')

    expect(store.tasks[task.id].columnId).toBe('col-2')
  })

  it('does nothing when moving non-existing task', () => {
    const store = useTaskStore()
    store.moveTask('non-existing', 'col-2')
    expect(Object.keys(store.tasks)).toHaveLength(0)
  })

  it('replaces all tasks with setTasks', () => {
    const store = useTaskStore()
    store.addTask('col-1', 'A')
    store.addTask('col-1', 'B')

    store.setTasks({
      'task-99': { id: 'task-99', columnId: 'col-3', title: 'Replaced', description: '' },
    })

    expect(Object.keys(store.tasks)).toHaveLength(1)
    expect(store.tasks['task-99'].title).toBe('Replaced')
  })

  it('returns tasks by ids preserving order', () => {
    const store = useTaskStore()
    const taskA = store.addTask('col-1', 'A')
    const taskB = store.addTask('col-1', 'B')
    const taskC = store.addTask('col-1', 'C')

    const result = store.getTasksByIds([taskB.id, taskA.id, 'missing', taskC.id])

    expect(result).toHaveLength(3)
    expect(result[0].title).toBe('B')
    expect(result[1].title).toBe('A')
    expect(result[2].title).toBe('C')
  })
})
