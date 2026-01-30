import type { Task } from './Task.ts'

export interface TodoState {
  tasks: Task[]
  searchQuery: string
}

export type TodoViewState = TodoState & {
  visibleTasks: Task[]
}
