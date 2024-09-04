const toDoForm = document.getElementById("todos-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todos-list");
let toDos = [];
const TODOS = "todos";

function saveTodos() {
  localStorage.setItem(TODOS, JSON.stringify(toDos)); // JSON.stringify : string으로 만들기 & JSON.parse : 배열로 만들기
}

// filter : array에서 지우고 싶은 item을 제외하고 새로운 array를 보여줌
// for example)
// function testFilter(item){item !== 3} --> 3이 아닌 게 true라는 것.
// [1,2,3,4,5].filter(testFilter); 결과--> [1,2,4,5]
function deleteTodo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
  saveTodos();
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
