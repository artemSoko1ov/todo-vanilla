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
    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return
    const button = this.dom.getDeleteButton(event.target)
    if (!button) return

    const taskId = taskElement.dataset.id
    if (!taskId) return

    taskElement.classList.add('is-disappearing')

    setTimeout(() => {
      this.store.deleteTask(taskId)
      this.updateView()
    }, 400)
  }

  handleDeleteAllTask = () => {
    this.store.deleteAll()
    this.updateView()
  }

  handleToggleTaskCompleted = (event: Event) => {
    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return

    const checkbox = this.dom.getToggleCheckbox(event.target)
    if (!checkbox) return

    const taskId = taskElement.dataset.id
    if (!taskId) return

    this.store.toggleCompleted(taskId)
    this.updateView()
  }

  handleTodoListClick = (event: Event) => {
    if (this.dom.getDeleteButton(event.target)) {
      this.handleDeleteTask(event)
      return
    }

    if (this.dom.getToggleCheckbox(event.target)) {
      this.handleToggleTaskCompleted(event)
    }
  }

  private updateView() {
    const visibleTasks = this.store.getFilteredTasks()
    const state = this.store.getState()

    this.renderer.render({
      ...state,
      visibleTasks,
    })
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
      this.handleDeleteAllTask,
    )
  }
}

export default TodoController
