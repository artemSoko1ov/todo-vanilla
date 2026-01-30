import type { Task, TaskId } from './types/Task.ts'
import type { TodoState } from './types/TodoState.ts'

class TodoStore {
  private state: TodoState
  constructor() {
    this.state = {
      tasks: [],
      searchQuery: '',
    }
  }

  getState(): TodoState {
    return this.state
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
  }

  deleteAll() {
    this.state = {
      ...this.state,
      tasks: [],
    }
  }

  toggleCompleted(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }
  }
}

export default TodoStore
