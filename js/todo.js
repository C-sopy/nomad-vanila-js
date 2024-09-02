const toDoForm = document.getElementById("todos-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todos-list");
const toDos = [];
const TODOS = "todos";

function saveTodos() {
  localStorage.setItem(TODOS, JSON.stringify(toDos));
}

function deleteTodo(event) {
  const li = event.target.parentElement;
  localStorage.removeItem(li);
  li.remove();
}

function paintTodo(newTodo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = newTodo;
  const btn = document.createElement("button");
  btn.innerText = "❌";
  btn.addEventListener("click", deleteTodo);
  li.appendChild(span);
  li.appendChild(btn);
  toDoList.appendChild(li);
}

function handleTodoSubmit(event) {
  event.preventDefault();
  const newTodo = toDoInput.value;
  toDoInput.value = "";
  toDos.push(newTodo);
  paintTodo(newTodo);
  saveTodos();
}

toDoForm.addEventListener("submit", handleTodoSubmit);

const savedTodos = localStorage.getItem(TODOS);
