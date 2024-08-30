const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

// 반복되는 변수는 const로 묶어두는 것도 좋다
const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

// JS는 함수를 실행시키는 동시에 그 함수의 첫번째 인자로 object를 넣어준다. 그래서 e 등으로 그 안의 정보에 접근할 수 있는 것.
function onLoginSubmit(e) {
  e.preventDefault(); // Js는 기본동작(submit후 자동 refresh등)을 막는 것을 허용함!(preventDefault)
  loginForm.classList.add(HIDDEN_CLASSNAME);
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  paintGreetings(username);
}

function paintGreetings(username) {
  greeting.innerText = `Bienvenu ${username} !`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
}

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null) {
  // show form
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginForm.addEventListener("submit", onLoginSubmit);
} else {
  // show greeting
  paintGreetings(savedUsername);
}
