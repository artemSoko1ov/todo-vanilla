import type { Task, TaskId } from './types/Task.ts'
import type { TodoState } from './types/TodoState.ts'

class TodoStore {
  private state: TodoState
  private storageKey = import.meta.env.VITE_TODO_STORAGE_KEY
  constructor() {
    this.state = {
      tasks: [],
      searchQuery: '',
    }
    this.loadTasks()
  }

  getState(): TodoState {
    return this.state
  }

  saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state.tasks))
  }

  loadTasks() {
    const data = localStorage.getItem(this.storageKey)
    if (!data) {
      this.state.tasks = []
      return
    }

    this.state = {
      ...this.state,
      tasks: JSON.parse(data),
    }
  }

  addTask(title: string) {
    const normalizedTitle = title.trim()

    if (!normalizedTitle) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      completed: false,
    }

    this.state = {
      ...this.state,
      tasks: [...this.state.tasks, newTask],
    }

    this.saveTasks()
  }

  setSearchQuery(query: string) {
    this.state = {
      ...this.state,
      searchQuery: query.trim(),
    }
  }

  getFilteredTasks(): Task[] {
    const { tasks, searchQuery } = this.state

    if (!searchQuery.trim()) return tasks

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  deleteTask(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.filter((task) => task.id !== id),
    }
    this.saveTasks()
  }

  deleteAll() {
    this.state = {
      ...this.state,
      tasks: [],
    }
    this.saveTasks()
  }

  toggleCompleted(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }
    this.saveTasks()
  }

  getTaskById(id: TaskId): Task | null {
    return this.state.tasks.find((task) => task.id === id) ?? null
  }
}

export default TodoStore
