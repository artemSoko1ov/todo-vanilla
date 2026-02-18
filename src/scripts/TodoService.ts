import TodoStore from './TodoStore.ts'
import type { Task, TaskId } from './types/Task.ts'
import TodoRepository from './TodoRepository.ts'

class TodoService {
  private store: TodoStore
  private repository: TodoRepository

  constructor(store = new TodoStore(), repository = new TodoRepository()) {
    this.store = store
    this.repository = repository
  }

  getState() {
    return this.store.getState()
  }

  getTaskById(id: TaskId) {
    return this.store.getTaskById(id)
  }

  async init() {
    const tasks = await this.repository.fetchTasks()
    this.store.setTasks(tasks)
  }

  async addTask(title: string) {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      completed: false,
    }

    this.store.addTask(newTask)
    const tasks = await this.repository.createTask(newTask)
    this.store.setTasks(tasks)
  }

  async deleteTask(id: TaskId) {
    this.store.deleteTask(id)

    const tasks = await this.repository.deleteTask(id)
    this.store.setTasks(tasks)
  }

  async deleteAll() {
    this.store.clearTasks()

    const tasks = await this.repository.deleteAllTasks()
    this.store.setTasks(tasks)
  }

  async toggleCompleted(id: TaskId) {
    const task = this.store.getTaskById(id)
    if (!task) return

    const updatedTask: Task = {
      ...task,
      completed: !task.completed,
    }

    this.store.updateTask(updatedTask)

    const tasks = await this.repository.updateTask(updatedTask)
    this.store.setTasks(tasks)
  }

  setSearchQuery(query: string) {
    this.store.setSearchQuery(query)
  }

  getFilteredTasks(): Task[] {
    const { tasks, searchQuery } = this.store.getState()

    if (!searchQuery.trim()) return tasks

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }
}

export default TodoService
