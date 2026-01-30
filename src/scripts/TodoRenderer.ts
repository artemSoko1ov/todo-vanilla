import type { TodoState, TodoViewState } from './types/TodoState.ts'
import type TodoDOM from './TodoDOM.ts'
import emptyMessages from './constants/emptyMessages.ts'
import stateClasses from './constants/stateClasses.ts'
import type { Task } from './types/Task.ts'

class TodoRenderer {
  dom: TodoDOM

  constructor(dom: TodoDOM) {
    this.dom = dom
  }

  render(state: TodoViewState) {
    this.renderEmptyState(state.tasks, state.visibleTasks, state.searchQuery)
    this.renderTasks(state.visibleTasks)
    this.renderTotal(state.tasks.length)
    this.renderDeleteAllButton(state.tasks.length)
  }

  renderTasks(tasks: TodoState['tasks']) {
    this.clearTodoList()

    this.dom.todoListElement.innerHTML = tasks
      .map(this.createTaskElement)
      .join('')
  }

  clearTodoList() {
    return (this.dom.todoListElement.innerHTML = '')
  }

  createTaskElement(task: Task): string {
    const { id, title, completed } = task

    return `
      <li class="todo-item"  data-id="${id}" data-js-todo-task>
        <input
          class="todo-item__checkbox"
          type="checkbox"
          data-js-todo-toggle
          ${completed ? 'checked' : ''}
        />
        <span class="todo-item__label">${title}</span>
        <button
          class="todo-item__delete-button"
          type="button"
          data-js-todo-delete
        >
          ✕
        </button>
      </li>
    `
  }

  renderEmptyState(tasks: Task[], visibleTasks: Task[], searchQuery: string) {
    let message = ''

    if (tasks.length === 0) {
      message = emptyMessages.noTasks
    } else if (searchQuery && visibleTasks.length === 0) {
      message = emptyMessages.notFound
    }

    this.dom.emptyMessageElement.textContent = message
    this.dom.emptyMessageElement.hidden = !message
  }

  renderTotal(count: number) {
    this.dom.totalTasksElement.textContent = String(count)
  }

  renderDeleteAllButton(tasksCount: number) {
    this.dom.deleteAllButtonElement.classList.toggle(
      stateClasses.isVisible,
      tasksCount > 0,
    )
  }
}

export default TodoRenderer
