import type { Task } from './types/Task.ts'

export class TodoApi {
  private baseUrl = import.meta.env.VITE_API_BASE_URL

  constructor() {}

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`)
      const data = await response.json()
      return data as Task[]
    } catch {
      throw new Error('Failed to fetch tasks')
    }
  }

  async createTask(newTask: Task) {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      const data = await response.json()
      return data as Task
    } catch {
      throw new Error('Failed to fetch tasks')
    }
  }

  updateTask() {}

  deleteTask() {}

  deleteAllTask() {}
}
