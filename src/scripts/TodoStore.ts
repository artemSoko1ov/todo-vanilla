import type { TodoState } from './types/TodoState.ts'
import type { Task, TaskId } from './types/Task.ts'

class TodoStore {
  private state: TodoState = {
    tasks: [],
    searchQuery: '',
  }

  getState(): TodoState {
    return {
      ...this.state,
      tasks: [...this.state.tasks],
    }
  }

  getTaskById(id: TaskId): Task | null {
    return this.state.tasks.find((task) => task.id === id) ?? null
  }

  setTasks(tasks: Task[]) {
    this.state = { ...this.state, tasks }
  }

  addTask(task: Task) {
    this.state = {
      ...this.state,
      tasks: [...this.state.tasks, task],
    }
  }

  deleteTask(id: TaskId) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.filter((task) => task.id !== id),
    }
  }

  updateTask(updatedTask: Task) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t,
      ),
    }
  }

  clearTasks() {
    this.state = {
      ...this.state,
      tasks: [],
    }
  }

  setSearchQuery(query: string) {
    this.state = {
      ...this.state,
      searchQuery: query.trim(),
    }
  }
}

export default TodoStore
