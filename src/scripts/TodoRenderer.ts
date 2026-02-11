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
    const items = tasks.map((task) => this.createTaskElement(task))
    this.dom.todoListElement.replaceChildren(...items)
  }

  createTaskElement(task: Task): HTMLLIElement {
    const { id, title, completed } = task

    const li = document.createElement('li')
    li.classList.add('todo-item')
    li.dataset.id = id
    li.setAttribute('data-js-todo-task', '')

    const input = document.createElement('input')
    input.classList.add('todo-item__checkbox')
    input.type = 'checkbox'
    input.checked = completed
    input.setAttribute('data-js-todo-toggle', '')

    const span = document.createElement('span')
    span.classList.add('todo-item__label')
    span.textContent = title

    const button = document.createElement('button')
    button.classList.add('todo-item__delete-button')
    button.type = 'button'
    button.textContent = '✕'
    button.setAttribute('data-js-todo-delete', '')

    li.append(input, span, button)

    return li
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
