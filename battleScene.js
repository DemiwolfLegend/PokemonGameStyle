
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0, y: 0
  },
  image: battleBackgroundImage
})

const draggle = new Monster(monsters.Draggle)
const emby = new Monster(monsters.Emby)

const renderedSprites = [draggle, emby]

emby.attacks.forEach((attack) => {
  const button = document.createElement('button');
  button.innerText = attack.name;
  document.querySelector('.attackList').append(button)
})


function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw()
  renderedSprites.forEach(sprite => {
    sprite.draw()
  })
}
animateBattle()

const queue = []
document.querySelectorAll('button').forEach(button => {
  // console.log({ button });
  button.addEventListener('click', () => {
    emby.attack({
      attack: attacks[button.textContent],
      recipient: draggle,
      renderedSprites
    })

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint()
      })
    }
    else {
      const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites
        })
      })
    }

  })
  button.addEventListener('mouseenter', () => {
    const selectedAttack = attacks[button.textContent];
    document.querySelector('.attackLabel').innerText = selectedAttack.type
    document.querySelector('.attackLabel').style.color = selectedAttack.color
  })
})

document.querySelector('#dialogBox').addEventListener('click', (event) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  }
  else {
    event.currentTarget.style.display = 'none';
  }
})