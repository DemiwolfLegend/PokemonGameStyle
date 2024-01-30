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
const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const battleZones = []

const offset = {
  x: -740,
  y: -650
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

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(new Boundry({
        position: {
          x: j * Boundry.width + offset.x,
          y: i * Boundry.height + offset.y
        }
      }))
    }
  })
})

const backgroundImage = new Image();
backgroundImage.src = './img/Pellet Town.png';
const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';
const playerImage = new Image()
playerImage.src = './img/playerDown.png'
const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'
const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerImage.width / 8,
    y: canvas.height / 2 - playerImage.height / 2
  },
  image: playerImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    down: playerImage,
    right: playerRightImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: backgroundImage
})
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
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

const movables = [background, ...boundaries, foreground, ...battleZones]

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
  background.draw()
  // boundaries.forEach(boundary => {
  //   boundary.draw()
  // })
  // battleZones.forEach(battleZone => {
  //   battleZone.draw()
  // })
  player.draw()
  foreground.draw()

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea = Math.max(player.position.x, battleZone.position.x)
      if (
        rectangleCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2
      ) {
        console.log("BattleZone collision")
        break
      }
    }
  }

  let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + 3
          }
        }
      })) {
        moving = false
        break
      }
    }
    if (moving) {
      movables.forEach(movable => {
        movable.position.y += 3;
      })
    }

  }
  else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x + 3,
            y: boundary.position.y
          }
        }
      })) {
        moving = false
        break
      }
    }
    if (moving) {
      movables.forEach(movable => {
        movable.position.x += 3;
      })
    }
  }
  else if (keys.s.pressed && lastKey === 's') {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - 3
          }
        }
      })) {
        moving = false
        break
      }
    }
    if (moving) {
      movables.forEach(movable => {
        movable.position.y -= 3;
      })
    }
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangleCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x - 3,
            y: boundary.position.y
          }
        }
      })) {
        moving = false
        break
      }
    }
    if (moving) {
      movables.forEach(movable => {
        movable.position.x -= 3;
      })
    }
  }
}
animate()

let lastKey = '';
window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      lastKey = 'w';
      break;

    case 'KeyA':
      keys.a.pressed = true;
      lastKey = 'a';
      break;

    case 'KeyS':
      keys.s.pressed = true;
      lastKey = 's';
      break;

    case 'KeyD':
      keys.d.pressed = true;
      lastKey = 'd';
      break;

    default:
      break;
  }
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