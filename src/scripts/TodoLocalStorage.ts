import type { Task } from './types/Task.ts'

class TodoLocalStorage {
  private storageKey = import.meta.env.VITE_TODO_STORAGE_KEY

  load(): Task[] {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) return []

    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  save(tasks: Task[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks))
    } catch {
      console.warn('Cannot save tasks to LocalStorage')
    }
  }

  clear() {
    localStorage.removeItem(this.storageKey)
  }
}

export default TodoLocalStorage
