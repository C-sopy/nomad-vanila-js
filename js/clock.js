const clock = document.querySelector("h2#clock");
const date = document.querySelector("h2#date");

function getClock() {
  const date = new Date();

  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");

  clock.innerText = `${hour}:${min}:${sec}`;
}

const today = new Date();

const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDay();

date.innerText = `${year}년 ${month}월 ${day}일`;

getClock();
setInterval(getClock, 1000);
