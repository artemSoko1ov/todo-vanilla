class TodoDOM {
  rootElement: Element
  newTaskFormElement: HTMLFormElement
  newTaskInputElement: HTMLInputElement
  todoListElement: HTMLElement

  searchTaskFormElement: HTMLFormElement
  searchTaskInputElement: HTMLInputElement
  totalTasksElement: HTMLElement
  deleteAllButtonElement: HTMLButtonElement
  emptyMessageElement: HTMLElement

  private selectors = {
    root: '[data-js-todo]',
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    searchTaskForm: '[data-js-todo-search-task-form]',
    searchTaskInput: '[data-js-todo-search-task-input]',
    totalTasks: '[data-js-todo-total-tasks]',
    deleteAllButton: '[data-js-todo-delete-all-button]',
    todoList: '[data-js-todo-list]',
    emptyMessage: '[data-js-todo-empty-message]',
  }

  constructor() {
    this.rootElement = this.getRequiredElement(this.selectors.root)
    this.newTaskFormElement = this.getRequiredElement(
      this.selectors.newTaskForm,
    ) as HTMLFormElement
    this.newTaskInputElement = this.getRequiredElement(
      this.selectors.newTaskInput,
    ) as HTMLInputElement
    this.todoListElement = this.getRequiredElement(
      this.selectors.todoList,
    ) as HTMLElement
    this.searchTaskFormElement = document.querySelector(
      this.selectors.searchTaskForm,
    ) as HTMLFormElement
    this.searchTaskInputElement = document.querySelector(
      this.selectors.searchTaskInput,
    ) as HTMLInputElement
    this.totalTasksElement = this.getRequiredElement(
      this.selectors.totalTasks,
    ) as HTMLElement
    this.deleteAllButtonElement = document.querySelector(
      this.selectors.deleteAllButton,
    ) as HTMLButtonElement
    this.emptyMessageElement = document.querySelector(
      this.selectors.emptyMessage,
    ) as HTMLElement
  }

  private getRequiredElement(selector: string): Element {
    const element = document.querySelector(selector)
    if (!element) {
      throw new Error(`TodoDOM: element not found for selector "${selector}"`)
    }
    return element
  }

  getValueAddInput() {
    const value = this.newTaskInputElement.value.trim()
    return value.length > 0 ? value : null
  }

  clearNewTaskInput() {
    this.newTaskInputElement.value = ''
  }

  getValueSearchInput() {
    const value = this.searchTaskInputElement.value.trim()
    return value.length > 0 ? value : null
  }

  getTaskElement(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLElement>('[data-js-todo-task]')
  }

  getDeleteButton(target: EventTarget | null): HTMLButtonElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLButtonElement>('[data-js-todo-delete]')
  }

  getToggleCheckbox(target: EventTarget | null): HTMLInputElement | null {
    if (!(target instanceof HTMLElement)) return null

    return target.closest<HTMLInputElement>('[data-js-todo-toggle]')
  }
}

export default TodoDOM
