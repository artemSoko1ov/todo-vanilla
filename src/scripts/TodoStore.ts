import type { Task, TaskId } from './types/Task.ts'
import type { TodoState } from './types/TodoState.ts'
import TodoApi from './TodoApi.ts'

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

  getTaskById(id: TaskId): Task | null {
    return this.state.tasks.find((task) => task.id === id) ?? null
  }

  saveTasksToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state.tasks))
  }

  async loadTasks() {
    try {
      const dataFromApi = await this.api.fetchTasks()

      this.state = {
        ...this.state,
        tasks: dataFromApi,
      }

      this.saveTasksToLocalStorage()
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
        tasks: this.validateTasks(dataFromLocalStorage),
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
    this.saveTasksToLocalStorage()
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

  async deleteTask(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.filter((task) => task.id !== id),
    }

    this.saveTasksToLocalStorage()
    await this.api.deleteTask(id)
  }

  deleteAll() {
    this.state = {
      ...this.state,
      tasks: [],
    }
    this.saveTasksToLocalStorage()
  }

  async toggleCompleted(task: Task) {
    const updatedTask = { ...task, completed: !task.completed }

    this.state = {
      ...this.state,
      tasks: this.state.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
    }
    this.saveTasksToLocalStorage()

    await this.api.updateTask(updatedTask)
  }

  private validateTasks(raw: string | null): Task[] {
    if (!raw) {
      return []
    }
    try {
      const parsed = JSON.parse(raw)

      return parsed as Task[]
    } catch {
      return []
    }
  }
}

export default TodoStore
