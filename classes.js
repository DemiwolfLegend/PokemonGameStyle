class Boundry {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position;
    this.width = 48
    this.height = 48
  }
  draw() {
    c.fillStyle = 'rgba(255,0,0,0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position
    this.image = new Image()
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.image.src = image.src
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation
  }
  draw() {
    c.save()
    c.translate(
      this.position.x + (this.width / 2),
      this.position.y + (this.height / 2)
    )
    c.rotate(this.rotation)
    c.translate(
      -(this.position.x + (this.width / 2)),
      -(this.position.y + (this.height / 2))
    )
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()
    if (this.animate) {
      if (this.frames.max > 1) {
        this.frames.elapsed++;
      }
      if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++;
        else this.frames.val = 0;
      }
    }
  }

}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }
  faint() {

    document.querySelector('#dialogBox').innerHTML = `${this.name} fainted!`
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
    audio.victory.play()
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogBox').style.display = 'block';
    document.querySelector('#dialogBox').innerHTML = `${this.name} used ${attack.name}`
    let healthBar = (this.isEnemy) ? '#EmbyhealthBar' : '#DraggleHealthBar'
    let movementDistance = (this.isEnemy) ? -20 : 20
    let rotation = (this.isEnemy) ? -2.2 : 1
    recipient.health = recipient.health - attack.damage
    switch (attack.name) {
      case 'Tackle':
        const tl = gsap.timeline()
        // if (this.isEnemy) movementDistance = -20
        tl.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete() {
            audio.tackleHit.play()
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + movementDistance / 2,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })
            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })
          }
        }).to(this.position, {
          x: this.position.x
        })
        break;
      case 'Fireball':
        audio.initFireball.play()
        const fireballImage = new Image()
        fireballImage.src = "./img/fireball.png"
        const fireball = new Sprite({
          position: { x: this.position.x, y: this.position.y },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation: rotation
        })
        // renderedSprites.push(fireball)
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete() {
            // renderedSprites.pop()
            audio.fireballHit.play()
            renderedSprites.splice(1, 1)
            audio.initFireball.stop()
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + movementDistance / 2,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })
            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })
          }
        })
        break;
      default:
        break;
    }
  }
}
