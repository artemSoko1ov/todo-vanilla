import TodoDOM from './TodoDOM.ts'
import TodoRenderer from './TodoRenderer.ts'
import TodoService from './TodoService.ts'
import stateClasses from './constants/stateClasses.ts'

class TodoController {
  service: TodoService
  dom: TodoDOM
  renderer: TodoRenderer

  constructor(
    service = new TodoService(),
    dom = new TodoDOM(),
    renderer = new TodoRenderer(dom),
  ) {
    this.service = service
    this.dom = dom
    this.renderer = renderer

    this.bindEvents()
    void this.init()
  }

  private async init() {
    await this.service.init()
    this.updateView()
  }

  handleAddTask = async (event: Event) => {
    event.preventDefault()

    const title = this.dom.getNewTaskTitle()
    if (!title) return

    await this.service.addTask(title)
    this.dom.clearNewTaskInput()
    this.updateView()
  }

  handleSearchTask = () => {
    const titleSearch = this.dom.getSearchQuery()

    this.service.setSearchQuery(titleSearch ?? '')

    this.updateView()
  }

  handleDeleteTask = async (event: Event) => {
    if (!this.dom.getDeleteButton(event.target)) return

    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return

    taskElement.classList.add(stateClasses.isDisappearing)

    setTimeout(() => {
      void this.service.deleteTask(taskId).then(() => {
        this.updateView()
      })
    }, 400)
  }

  handleDeleteAllTasks = async () => {
    await this.service.deleteAllTasks()
    this.updateView()
  }

  handleToggleTaskCompleted = async (event: Event) => {
    if (!this.dom.getToggleCheckbox(event.target)) return

    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    await this.service.toggleCompleted(taskId)
    this.updateView()
  }

  handleDetailsTask = (event: Event) => {
    const taskId = this.getTaskIdFromEvent(event)
    if (!taskId) return

    const task = this.service.getTaskById(taskId)
    if (!task) return

    this.renderer.renderTaskDetails(task)
  }

  handleTodoListClick = async (event: Event) => {
    const taskElement = this.dom.getTaskElement(event.target)
    if (!taskElement) return

    if (this.dom.getDeleteButton(event.target)) {
      await this.handleDeleteTask(event)
      return
    }

    if (this.dom.getToggleCheckbox(event.target)) {
      await this.handleToggleTaskCompleted(event)
      return
    }

    this.handleDetailsTask(event)
  }

  private updateView() {
    const visibleTasks = this.service.getFilteredTasks()
    const state = this.service.getState()

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
    this.dom.newTaskFormElement.addEventListener('submit', async (event) => {
      await this.handleAddTask(event)
    })
    this.dom.searchTaskInputElement.addEventListener('input', () => {
      void this.handleSearchTask()
    })
    this.dom.todoListElement.addEventListener('click', (event) => {
      void this.handleTodoListClick(event)
    })
    this.dom.deleteAllButtonElement.addEventListener('click', () => {
      void this.handleDeleteAllTasks()
    })
  }
}

export default TodoController
