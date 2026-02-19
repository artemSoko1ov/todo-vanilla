class TodoDOM {
  rootElement: HTMLElement
  newTaskFormElement: HTMLFormElement
  newTaskInputElement: HTMLInputElement
  todoListElement: HTMLElement
  searchTaskFormElement: HTMLFormElement
  searchTaskInputElement: HTMLInputElement
  totalTasksElement: HTMLElement
  deleteAllButtonElement: HTMLButtonElement
  emptyMessageElement: HTMLElement

  private readonly selectors = {
    root: '[data-js-todo]',
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    searchTaskForm: '[data-js-todo-search-task-form]',
    searchTaskInput: '[data-js-todo-search-task-input]',
    totalTasks: '[data-js-todo-total-tasks]',
    deleteAllButton: '[data-js-todo-delete-all-button]',
    todoList: '[data-js-todo-list]',
    emptyMessage: '[data-js-todo-empty-message]',
    task: '[data-js-todo-task]',
    taskDeleteButton: '[data-js-todo-delete]',
    taskToggleCheckbox: '[data-js-todo-toggle]',
  }

  constructor() {
    const root = document.querySelector<HTMLElement>(this.selectors.root)
    if (!root) {
      throw new Error(
        `TodoDOM: root element not found for selector "${this.selectors.root}"`,
      )
    }
    this.rootElement = root

    this.newTaskFormElement = this.getRequiredElement<HTMLFormElement>(
      this.selectors.newTaskForm,
    )
    this.newTaskInputElement = this.getRequiredElement<HTMLInputElement>(
      this.selectors.newTaskInput,
    )
    this.todoListElement = this.getRequiredElement<HTMLElement>(
      this.selectors.todoList,
    )
    this.searchTaskFormElement = this.getRequiredElement<HTMLFormElement>(
      this.selectors.searchTaskForm,
    )
    this.searchTaskInputElement = this.getRequiredElement<HTMLInputElement>(
      this.selectors.searchTaskInput,
    )
    this.totalTasksElement = this.getRequiredElement<HTMLElement>(
      this.selectors.totalTasks,
    )
    this.deleteAllButtonElement = this.getRequiredElement<HTMLButtonElement>(
      this.selectors.deleteAllButton,
    )
    this.emptyMessageElement = this.getRequiredElement<HTMLElement>(
      this.selectors.emptyMessage,
    )
  }

  private getRequiredElement<T extends Element>(selector: string): T {
    const element = this.rootElement.querySelector(selector)
    if (!element) {
      throw new Error(`TodoDOM: element not found for selector "${selector}"`)
    }
    return element as T
  }

  getNewTaskTitle(): string | null {
    const value = this.newTaskInputElement.value.trim()
    return value.length > 0 ? value : null
  }

  clearNewTaskInput(): void {
    this.newTaskInputElement.value = ''
  }

  getSearchQuery(): string | null {
    const value = this.searchTaskInputElement.value.trim()
    return value.length > 0 ? value : ''
  }

  getTaskElement(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLElement>(this.selectors.task)
  }

  getDeleteButton(target: EventTarget | null): HTMLButtonElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLButtonElement>(this.selectors.taskDeleteButton)
  }

  getToggleCheckbox(target: EventTarget | null): HTMLInputElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLInputElement>(this.selectors.taskToggleCheckbox)
  }
}

export default TodoDOM
