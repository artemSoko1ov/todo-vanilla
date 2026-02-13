import type { Task } from './types/Task.ts'

export class TodoApi {
  baseUrl: string

  constructor() {
    this.baseUrl = 'http://localhost:3001'
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`)
      const data = await response.json()
      return data as Task[]
    } catch {
      throw new Error('Failed to fetch tasks')
    }

    // return fetch(`${this.baseUrl}/tasks`)
    //   .then((response) => {
    //     return response.json()
    //   })
    //   .then((data) => data as Task[])
    //   .catch(() => {
    //     throw new Error('Failed to fetch tasks')
    //   })
  }

  updateTask() {}

  deleteTask() {}

  deleteAllTask() {}
}
