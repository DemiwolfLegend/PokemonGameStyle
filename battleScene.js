const battleBackground = new Sprite({
  position: {
    x: 0, y: 0
  },
  image: { src: './img/battleBackground.png' }
})

let draggle;
let emby;
let renderedSprites;
let queue

function initBattle() {
  draggle = new Monster(monsters.Draggle)
  // console.log("Draggle", monsters.Draggle)
  emby = new Monster(monsters.Emby)
  // console.log("Emby", monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []

  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogBox').style.display = 'none';
  document.querySelector('#DraggleHealthBar').style.width = '100%';
  document.querySelector('#EmbyhealthBar').style.width = '100%';
  document.querySelector('#OverlappingDiv').style.display = 'none';


  document.querySelector('.attackLabel').innerText = 'Attack Type';
  document.querySelector('.attackLabel').style.color = 'black';

  document.querySelector('.attackList').innerHTML = ''

  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerText = attack.name;
    document.querySelector('.attackList').append(button)
  })

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
          audio.battle.stop()
          audio.Map.play()
        })
        queue.push(() => {
          document.querySelector('#OverlappingDiv').style.display = 'block'
          // console.log("Check 1")
          gsap.to('#OverlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              battle.initiated = false
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#OverlappingDiv', {
                opacity: 0
              })
            }
          })
        })
        return;
      }

      const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites
        })
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint()
            audio.battle.stop()
            audio.Map.play()
          })
          queue.push(() => {
            document.querySelector('#OverlappingDiv').style.display = 'block'
            // console.log("Check 1")
            gsap.to('#OverlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                battle.initiated = false
                animate()
                document.querySelector('#userInterface').style.display = 'none'
                gsap.to('#OverlappingDiv', {
                  opacity: 0
                })
              }
            })
          })
        }
      })


    })
    button.addEventListener('mouseenter', () => {
      const selectedAttack = attacks[button.textContent];
      document.querySelector('.attackLabel').innerText = selectedAttack.type
      document.querySelector('.attackLabel').style.color = selectedAttack.color
    })
  })
}

let battleAnimationId;
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw()
  renderedSprites.forEach(sprite => {
    sprite.draw()
  })
}
// initBattle()
// animateBattle()
animate()

document.querySelector('#dialogBox').addEventListener('click', (event) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  }
  else {
    event.currentTarget.style.display = 'none';
  }
})