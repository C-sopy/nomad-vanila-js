const images = ["0.jpg", "1.jpg", "2.jpg"]; // 이미지.확장자 이름 배열

const chosenImage = images[Math.floor(Math.random() * images.length)];

const image = document.createElement("img");

image.src = `img/${chosenImage}`;

document.body.appendChild(image); // append : 가장 뒤에/ prepend : 가장 앞에(위에)
