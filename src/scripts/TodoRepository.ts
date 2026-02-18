import TodoApi from './TodoApi.ts'
import type { Task, TaskId } from './types/Task.ts'
import TodoLocalStorage from './TodoLocalStorage.ts'

class TodoRepository {
  private api: TodoApi
  private todoStorage: TodoLocalStorage

  constructor(api = new TodoApi(), todoStorage = new TodoLocalStorage()) {
    this.api = api
    this.todoStorage = todoStorage
  }

  async fetchTasks(): Promise<Task[]> {
    try {
      const tasksFromApi: Task[] = await this.api.fetchTasks()

      this.todoStorage.save(tasksFromApi)
      return tasksFromApi
    } catch {
      return this.todoStorage.load()
    }
  }

  async createTask(task: Task): Promise<Task[]> {
    try {
      const createdTask = await this.api.createTask(task)
      const cachedTasks = this.todoStorage.load()
      const nextTasks = [
        ...cachedTasks.filter((t) => t.id !== createdTask.id),
        createdTask,
      ]

      this.todoStorage.save(nextTasks)
      return nextTasks
    } catch {
      const cachedTasks = this.todoStorage.load()
      const nextTasks = [...cachedTasks, task]

      this.todoStorage.save(nextTasks)
      return nextTasks
    }
  }

  async updateTask(task: Task): Promise<Task[]> {
    try {
      const updatedTask = await this.api.updateTask(task)
      const cachedTasks = this.todoStorage.load()
      const nextTasks = cachedTasks.map((cachedTask) =>
        cachedTask.id === updatedTask.id ? updatedTask : cachedTask,
      )

      this.todoStorage.save(nextTasks)
      return nextTasks
    } catch {
      const cachedTasks = this.todoStorage.load()
      const nextTasks = cachedTasks.map((cachedTask) =>
        cachedTask.id === task.id ? task : cachedTask,
      )

      this.todoStorage.save(nextTasks)
      return nextTasks
    }
  }

  async deleteTask(id: TaskId): Promise<Task[]> {
    const cachedTasks = this.todoStorage.load()
    const nextTasks = cachedTasks.filter((task) => task.id !== id)

    try {
      await this.api.deleteTask(id)
      this.todoStorage.save(nextTasks)
      return nextTasks
    } catch {
      console.error('Failed to delete task on server')
      this.todoStorage.save(cachedTasks)
      return cachedTasks
    }
  }

  async deleteAllTasks(): Promise<Task[]> {
    const cachedTasks = this.todoStorage.load()

    try {
      await this.api.deleteAllTasks()
      this.todoStorage.clear()
      return []
    } catch (error) {
      console.error('Failed to delete tasks on server', error)
      this.todoStorage.save(cachedTasks)
      return cachedTasks
    }
  }
}

export default TodoRepository
