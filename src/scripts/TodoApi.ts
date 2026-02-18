import type { Task, TaskId } from './types/Task.ts'

class TodoApi {
  private apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  constructor() {}

  async fetchTasks(): Promise<Task[]> {
    const response = await fetch(`${this.apiBaseUrl}/tasks`)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    return (await response.json()) as Task[]
  }

  async createTask(newTask: Task): Promise<Task> {
    const response = await fetch(`${this.apiBaseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return (await response.json()) as Task
  }

  async updateTask(updatedTask: Task): Promise<Task> {
    const response = await fetch(`${this.apiBaseUrl}/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return (await response.json()) as Task
  }

  async deleteTask(id: TaskId): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
  }

  async deleteAllTasks(): Promise<void> {
    try {
      const tasks = await this.fetchTasks()
      await Promise.all(tasks.map((task) => this.deleteTask(task.id)))
    } catch {
      throw new Error('Failed to delete all tasks')
    }
  }
}

export default TodoApi
