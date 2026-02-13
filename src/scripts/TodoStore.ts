import type { Task, TaskId } from './types/Task.ts'
import type { TodoState } from './types/TodoState.ts'
import { TodoApi } from './TodoApi.ts'

class TodoStore {
  private state: TodoState
  private storageKey = import.meta.env.VITE_TODO_STORAGE_KEY
  private api: TodoApi

  constructor(api = new TodoApi()) {
    this.api = api

    this.state = {
      tasks: [],
      searchQuery: '',
    }
  }

  async init() {
    await this.loadTasks()
  }

  getState(): TodoState {
    return this.state
  }

  saveTasksOnLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state.tasks))
  }

  async loadTasks() {
    try {
      const dataFromApi = await this.api.getTasks()

      this.state = {
        ...this.state,
        tasks: dataFromApi,
      }

      this.saveTasksOnLocalStorage()
    } catch {
      const dataFromLocalStorage = localStorage.getItem(this.storageKey)

      if (!dataFromLocalStorage) {
        this.state = {
          ...this.state,
          tasks: [],
        }
        return
      }

      this.state = {
        ...this.state,
        tasks: JSON.parse(dataFromLocalStorage),
      }
    }
  }

  async addTask(title: string) {
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

    await this.api.createTask(newTask)
    this.saveTasksOnLocalStorage()
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
    this.saveTasksOnLocalStorage()
  }

  deleteAll() {
    this.state = {
      ...this.state,
      tasks: [],
    }
    this.saveTasksOnLocalStorage()
  }

  toggleCompleted(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }
    this.saveTasksOnLocalStorage()
  }

  getTaskById(id: TaskId): Task | null {
    return this.state.tasks.find((task) => task.id === id) ?? null
  }
}

export default TodoStore
