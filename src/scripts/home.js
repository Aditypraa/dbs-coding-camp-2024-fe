const TODOS = []
const RENDER_EVENT = 'RENDER_EVENT'
const STORAGE_KEY = 'TODO_APPS'
const SAVED_EVENT = 'saved-todo'

const formInput = document.getElementById('form-input')

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}

const saveData = () => {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(TODOS)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

const loadDataFromStorage = () => {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if (data !== null) {
    for (const todo of data) {
      TODOS.push(todo)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

const makeTodo = (todo) => {
  const { name, description } = todo

  const card = document.createElement('div')
  card.classList.add('card')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardBody.innerHTML = `
      <h3>${name}</h3>
      <p>${description}</p>
  `

  card.append(cardBody)

  return card
}

formInput.addEventListener('submit', (e) => {
  e.preventDefault()

  const name = event.target.elements.name.value
  const description = event.target.elements.description.value

  TODOS.push({
    id: new Date(),
    name,
    description,
  })

  document.dispatchEvent(new Event(RENDER_EVENT))

  saveData()
})

document.addEventListener(RENDER_EVENT, function () {
  const todoList = document.getElementById('todo-list')

  // clearing todo list item
  todoList.innerHTML = ''

  for (const todoItem of TODOS) {
    const todoElement = makeTodo(todoItem)

    todoList.append(todoElement)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist()) {
    loadDataFromStorage()
  }
})
