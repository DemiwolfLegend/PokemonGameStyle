const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// console.log(c)
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = './img/Pellet Town.png';
const playerImage = new Image()
playerImage.src = './img/playerDown.png'

console.log(backgroundImage);

backgroundImage.onload = () => {
  c.drawImage(backgroundImage, -740, -600);
  console.log("Pallet Town image loaded...");
  playerImage.onload = () => {
    c.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 4,
      playerImage.height,
      canvas.width / 2 - playerImage.width / 8,
      canvas.height / 2 - playerImage.height / 2,
      playerImage.width / 4,
      playerImage.height
    )
    console.log("player image loaded...")
  }
}
