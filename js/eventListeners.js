addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  )
  const velocity = {
    x: Math.cos(angle) * 20,
    y: Math.sin(angle) * 20
  }
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  )
})
