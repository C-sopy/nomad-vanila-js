const toDoForm = document.getElementById("todos-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todos-list");
let toDos = [];
const TODOS = "todos";

function saveTodos() {
  localStorage.setItem(TODOS, JSON.stringify(toDos)); // JSON.stringify : string으로 만들기 & JSON.parse : 배열로 만들기
}

function deleteTodo(event) {
  const li = event.target.parentElement;
  localStorage.removeItem(li);
  li.remove();
}

function paintTodo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  const span = document.createElement("span");
  span.innerText = newTodo.text;
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
  const newTodoObj = {
    text: newTodo,
    id: Date.now(),
  };
  toDos.push(newTodoObj);
  paintTodo(newTodoObj);
  saveTodos();
}

toDoForm.addEventListener("submit", handleTodoSubmit);

const savedTodos = localStorage.getItem(TODOS);

if (savedTodos !== null) {
  const parsedTodos = JSON.parse(savedTodos);
  toDos = parsedTodos;
  parsedTodos.forEach(paintTodo);
}
