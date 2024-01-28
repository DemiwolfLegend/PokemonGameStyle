const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// console.log(c)
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}
class Boundry {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position;
    this.width = 48
    this.height = 48
  }
  draw() {
    c.fillStyle = 'Red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const boundaries = []

const offset = {
  x: -740,
  y: -600
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(new Boundry({
        position: {
          x: j * Boundry.width + offset.x,
          y: i * Boundry.height + offset.y
        }
      }))
    }
  })
})
console.log(boundaries)

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
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position
    this.image = image
    this.frames = frames
    this.width = this.image.width / this.frames.max
    this.height = this.image.height
  }
  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
  }
  loadPlayer() {
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
}

// canvas.width / 2 - this.image.width / 8,
//       canvas.height / 2 - this.image.height / 2,

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerImage.width / 8,
    y: canvas.height / 2 - playerImage.height / 2
  },
  image: playerImage,
  frames: { max: 4 }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
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

const testBoundary = new Boundry({
  position: {
    x: 400,
    y: 500
  }
})
const movables = [background, testBoundary]

function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate)
  // console.log("Animate...")
  background.draw()
  // boundaries.forEach(boundary => {
  //   boundary.draw()
  // })
  testBoundary.draw()
  player.draw()

  if (rectangleCollision({
    rectangle1: player,
    rectangle2: testBoundary
  })) {
    console.log("Colliding")
  }

  if (keys.w.pressed && lastKey === 'w') {
    movables.forEach(movable => {
      movable.position.y += 3;
    })
  }
  else if (keys.a.pressed && lastKey === 'a') {
    movables.forEach(movable => {
      movable.position.x += 3;
    })
  }
  else if (keys.s.pressed && lastKey === 's') {
    movables.forEach(movable => {
      movable.position.y -= 3;
    })
  }
  else if (keys.d.pressed && lastKey === 'd') {
    movables.forEach(movable => {
      movable.position.x -= 3;
    })
  }
}
animate()

let lastKey = '';
window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      lastKey = 'w';
      //console.log("A key is pressed..", event.code)
      break;

    case 'KeyA':
      keys.a.pressed = true;
      lastKey = 'a';
      //console.log("A key is pressed..", event.code)
      break;

    case 'KeyS':
      keys.s.pressed = true;
      lastKey = 's';
      //console.log("A key is pressed..", event.code)
      break;

    case 'KeyD':
      keys.d.pressed = true;
      lastKey = 'd';
      //console.log("A key is pressed..", event.code)
      break;

    default:
      break;
  }
  // console.log(keys);
})
window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false
      break;

    case 'KeyA':
      keys.a.pressed = false
      break;

    case 'KeyS':
      keys.s.pressed = false
      break;

    case 'KeyD':
      keys.d.pressed = false
      break;

    default:
      break;
  }
})