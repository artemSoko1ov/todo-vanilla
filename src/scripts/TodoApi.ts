import type { Task, TaskId } from './types/Task.ts'

class TodoApi {
  private apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  constructor() {}

  async fetchTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks`)
      const data = await response.json()
      return data as Task[]
    } catch {
      throw new Error('Failed to fetch tasks')
    }
  }

  async createTask(newTask: Task) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      const data = await response.json()
      return data as Task
    } catch {
      throw new Error('Failed to create task')
    }
  }

  async updateTask(updatedTask: Task) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/tasks/${updatedTask.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        },
      )
      const data = await response.json()
      return data as Task
    } catch {
      throw new Error('Failed to update task')
    }
  }

  async deleteTask(id: TaskId) {
    try {
      await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
        method: 'DELETE',
      })
    } catch {
      throw new Error('Failed to delete task')
    }
  }

  async deleteAllTasks() {
    try {
      const tasks = await this.fetchTasks()
      await Promise.all(tasks.map((task) => this.deleteTask(task.id)))
    } catch {
      throw new Error('Failed to delete all tasks')
    }
  }
}

export default TodoApi
