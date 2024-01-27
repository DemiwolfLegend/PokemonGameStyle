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

// console.log(backgroundImage);

backgroundImage.onload = () => {
  console.log("Pallet Town image loaded...");
}
playerImage.onload = () => {
  console.log("player image loaded...")
}

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position
    this.image = image
  }
  draw() {

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y
    );
  }
}

const background = new Sprite({
  position: {
    x: -740,
    y: -600
  },
  image: backgroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
}

function animate() {
  window.requestAnimationFrame(animate)
  // console.log("Animate...")
  background.draw()

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
}
animate()

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true
      console.log("A key is pressed..", event.code)
      break;

    case 'KeyA':
      keys.a.pressed = true
      console.log("A key is pressed..", event.code)
      break;

    case 'KeyS':
      keys.s.pressed = true
      console.log("A key is pressed..", event.code)
      break;

    case 'KeyD':
      keys.d.pressed = true
      console.log("A key is pressed..", event.code)
      break;

    default:
      break;
  }
})