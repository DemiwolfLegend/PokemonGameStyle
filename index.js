const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// console.log(c)
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = './img/Pellet Town.png';
console.log(backgroundImage);

backgroundImage.onload = () => {
  c.drawImage(backgroundImage, -750, -550);
  console.log("Pallet Town image loaded...");
}