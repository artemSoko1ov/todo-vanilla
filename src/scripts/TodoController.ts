import TodoStore from './TodoStore.ts'
import TodoDOM from './TodoDOM.ts'
import TodoRenderer from './TodoRenderer.ts'

class TodoController {
  store: TodoStore
  dom: TodoDOM
  renderer: TodoRenderer

  constructor(
    store = new TodoStore(),
    dom = new TodoDOM(),
    renderer = new TodoRenderer(dom),
  ) {
    this.store = store
    this.dom = dom
    this.renderer = renderer

    this.bindEvents()
    void this.init()
  }

  private async init() {
    await this.store.init()
    this.updateView()
  }

  handleAddTask = (event: Event) => {
    event.preventDefault()

    const title = this.dom.getValueAddInput()
    if (!title) return

    this.store.addTask(title)
    this.dom.clearNewTaskInput()
    this.updateView()
  }

  handleSearchTask = () => {
    const titleSearch = this.dom.getValueSearchInput()

    this.store.setSearchQuery(titleSearch ?? '')

    this.updateView()
  }

  handleDeleteTask = (event: Event) => {
    if (!this.dom.getDeleteButton(event.target)) return

    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return

    taskElement.classList.add('is-disappearing')

    setTimeout(() => {
      this.store.deleteTask(taskId)
      this.updateView()
    }, 400)
  }

  handleDeleteAllTasks = () => {
    this.store.deleteAll()
    this.updateView()
  }

  handleToggleTaskCompleted = (event: Event) => {
    if (!this.dom.getToggleCheckbox(event.target)) return

    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    this.store.toggleCompleted(taskId)
    this.updateView()
  }

  handleDetailsTask = (event: Event) => {
    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    const task = this.store.getTaskById(taskId)
    if (!task) return

    this.renderer.renderDetailsTask(task)
  }

  handleTodoListClick = (event: Event) => {
    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return

    if (this.dom.getDeleteButton(event.target)) {
      this.handleDeleteTask(event)
      return
    }

    if (this.dom.getToggleCheckbox(event.target)) {
      this.handleToggleTaskCompleted(event)
      return
    }

    this.handleDetailsTask(event)
  }

  private updateView() {
    const visibleTasks = this.store.getFilteredTasks()
    const state = this.store.getState()

    this.renderer.render({
      ...state,
      visibleTasks,
    })
  }

  private getTaskIdFromEvent(event: Event): string | null {
    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return null

    return taskElement.dataset.id ?? null
  }

  bindEvents() {
    this.dom.newTaskFormElement?.addEventListener('submit', this.handleAddTask)
    this.dom.searchTaskInputElement?.addEventListener(
      'input',
      this.handleSearchTask,
    )
    this.dom.todoListElement?.addEventListener(
      'click',
      this.handleTodoListClick,
    )
    this.dom.deleteAllButtonElement?.addEventListener(
      'click',
      this.handleDeleteAllTasks,
    )
  }
}

export default TodoController
