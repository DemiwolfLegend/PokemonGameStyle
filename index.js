const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let clicked = false

// audio.Map.play()
// console.log()
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
  frames: { max: 4, hold: 10 },
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
  image: { src: './img/Pellet Town.png' }
})
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: { src: './img/foregroundObjects.png' }
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

const battle = {
  initiated: false
}
let lastkey;

function animate() {

  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
  const animationId = window.requestAnimationFrame(animate)
  background.draw()
  // boundaries.forEach(boundary => {
  //   boundary.draw()
  // })
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true;
  player.animate = false;

  // console.log(animationId)
  if (battle.initiated) return

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    // console.log(`Moving : ${moving}`)
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)
        ) * (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
      if (
        rectangleCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("BattleZone Activate...")
        audio.initBattle.play()
        audio.battle.play()
        audio.Map.stop()
        battle.initiated = true

        window.cancelAnimationFrame(animationId)

        gsap.to('#OverlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('#OverlappingDiv', {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle()
                animateBattle();
                gsap.to('#OverlappingDiv', {
                  opacity: 0,
                  duration: 0.4,
                })
              }
            })
          }
        })
        break
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    // console.log(`lastKey : ${lastKey}`)
    player.animate = true;
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
    // console.log(`lastKey : ${lastKey}`)
    player.animate = true;
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
    // console.log(`lastkey : ${lastkey}`)
    player.animate = true;
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
    // console.log(`lastkey : ${lastkey}`)
    player.animate = true;
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
// animate()


// window.addEventListener("click", () => {
// })

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