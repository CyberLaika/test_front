const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

const socket = io()

const x = canvas.width / 2
const y = canvas.height / 2

var oldX = -1111111
var oldY = -1111111

let player
let bot1
let bot2

let isGameOver = false

const botsAndPlayer = []


function drawGameOver() {
  c.font = "20px Courier New";
  c.textAlign = 'center';
  c.fillStyle = "#ffffff";
  c.fillText("GAME OVER", canvas.width/2, canvas.height/2);
}

const sessionInfo = {
  playerX: player.x,
  playerY: player.y,
  bot1X: bot1.x,
  bot1Y: bot1.y,
  bot2X: bot2.x,
  bot2Y: bot2.y,
}

socket.on('sessionInfo', (sessionInfo) => {
  console.log(sessionInfo)
  player = new Player(sessionInfo['playerX'], sessionInfo['playerY'], 7, 'white')
  bot1 = new Player(sessionInfo['bot1X'], sessionInfo['bot1Y'], 7, 'red')
  bot2 = new Player(sessionInfo['bot2X'], sessionInfo['bot2Y'], 7, 'orange')
  player.draw()
  bot1.draw()
  bot2.draw()
  botsAndPlayer.push(bot1)
  botsAndPlayer.push(bot2)
  botsAndPlayer.push(player)
}) 

socket.on('updateBot',  ({ x1, y1, x2, y2 }) => {
  if (isGameOver) return
  if (bot1){
    bot1.x = x1
    bot1.y = y1
  }
  if (bot2){
    bot2.x = x2
    bot2.y = y2
  }
  console.log('bots info updated')
}) 

socket.on('gameOver', () => {
  isGameOver = true
  console.log('game is over')
}) 

const projectiles = []
const particles = []

let animationId
function animate() {
  if (isGameOver){
    drawGameOver()
  } else {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

     for (let index = botsAndPlayer.length - 1; index >= 0; index--) {
          botsAndPlayer[index].draw()
      }
  }
}

var i = 0

// пока оставляем рассчет на стороне клиента
setInterval(() => {
  if (botsAndPlayer.length > 0 && (oldX != player.x || oldY != player.y)){
    socket.emit(
      'updatePlayer', { x: player.x, y: player.y },
    )
    oldX = player.x
    oldY = player.y
    console.log(`update sended`)
  }
}, 15)

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
  }
}

const SPEED = 2
const playerInputs = []

setInterval(() => {
  if (isGameOver) return

  if (keys.w.pressed) {
    player.y = player.y - SPEED
  }

  if (keys.a.pressed) {
    player.x = player.x - SPEED
  }

  if (keys.s.pressed) {
   player.y = player.y + SPEED
  }

  if (keys.d.pressed) {
     player.x = player.x + SPEED
  }
}, 15)


window.addEventListener('keydown', (event) => {
  if (isGameOver) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true
      break

    case 'KeyA':
      keys.a.pressed = true
      break

    case 'KeyS':
      keys.s.pressed = true
      break

    case 'KeyD':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  if (isGameOver) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false
      break

    case 'KeyA':
      keys.a.pressed = false
      break

    case 'KeyS':
      keys.s.pressed = false
      break

    case 'KeyD':
      keys.d.pressed = false
      break
  }
})







animate()


// function spawnEnemies() {
//   setInterval(() => {
//     const radius = Math.random() * (30 - 4) + 4

//     let x
//     let y

//     if (Math.random() < 0.5) {
//       x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
//       y = Math.random() * canvas.height
//     } else {
//       x = Math.random() * canvas.width
//       y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
//     }

//     const color = `hsl(${Math.random() * 360}, 50%, 50%)`

//     const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

//     const velocity = {
//       x: Math.cos(angle),
//       y: Math.sin(angle)
//     }

//     enemies.push(new Enemy(x, y, radius, color, velocity))
//   }, 1000)
// }



  // for (let index = particles.length - 1; index >= 0; index--) {
  //   const particle = particles[index]

  //   if (particle.alpha <= 0) {
  //     particles.splice(index, 1)
  //   } else {
  //     particle.update()
  //   }
  // }

//   for (let index = projectiles.length - 1; index >= 0; index--) {
//     const projectile = projectiles[index]

//     projectile.update()

//     // remove from edges of screen
//     if (
//       projectile.x - projectile.radius < 0 ||
//       projectile.x - projectile.radius > canvas.width ||
//       projectile.y + projectile.radius < 0 ||
//       projectile.y - projectile.radius > canvas.height
//     ) {
//       projectiles.splice(index, 1)
//     }
//   }

//   for (let index = enemies.length - 1; index >= 0; index--) {
//     const enemy = enemies[index]

//     enemy.update()

//     const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

//     //end game
//     if (dist - enemy.radius - player.radius < 1) {
//       cancelAnimationFrame(animationId)
//     }

//     for (
//       let projectilesIndex = projectiles.length - 1;
//       projectilesIndex >= 0;
//       projectilesIndex--
//     ) {
//       const projectile = projectiles[projectilesIndex]

//       const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

//       // when projectiles touch enemy
//       if (dist - enemy.radius - projectile.radius < 1) {
//         // create explosions
//         for (let i = 0; i < enemy.radius * 2; i++) {
//           particles.push(
//             new Particle(
//               projectile.x,
//               projectile.y,
//               Math.random() * 2,
//               enemy.color,
//               {
//                 x: (Math.random() - 0.5) * (Math.random() * 6),
//                 y: (Math.random() - 0.5) * (Math.random() * 6)
//               }
//             )
//           )
//         }
//         // this is where we shrink our enemy
//         if (enemy.radius - 10 > 5) {
//           score += 100
//           scoreEl.innerHTML = score
//           gsap.to(enemy, {
//             radius: enemy.radius - 10
//           })
//           projectiles.splice(projectilesIndex, 1)
//         } else {
//           // remove enemy if they are too small
//           score += 150
//           scoreEl.innerHTML = score

//           enemies.splice(index, 1)
//           projectiles.splice(projectilesIndex, 1)
//         }
//       }
//     }
//   }
// }

// spawnEnemies()
