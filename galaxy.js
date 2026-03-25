const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
});

// Stars
let stars = [];

function initStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.02
    });
  }
}

// Nebula clouds
const nebulas = [
  { x: 0.2, y: 0.3, r: 300, color: 'rgba(103, 126, 234, 0.07)' },
  { x: 0.8, y: 0.6, r: 350, color: 'rgba(118, 75, 162, 0.07)' },
  { x: 0.5, y: 0.8, r: 280, color: 'rgba(0, 200, 255, 0.05)' },
  { x: 0.1, y: 0.7, r: 250, color: 'rgba(103, 126, 234, 0.05)' },
  { x: 0.9, y: 0.2, r: 320, color: 'rgba(0, 150, 255, 0.06)' },
];

function drawNebulas() {
  nebulas.forEach(n => {
    const gradient = ctx.createRadialGradient(
      n.x * canvas.width, n.y * canvas.height, 0,
      n.x * canvas.width, n.y * canvas.height, n.r
    );
    gradient.addColorStop(0, n.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStars() {
  stars.forEach(star => {
    star.opacity += star.speed;
    if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();
  });
}

// Shooting star
let shootingStar = null;

function createShootingStar() {
  shootingStar = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    len: Math.random() * 150 + 100,
    speed: Math.random() * 8 + 6,
    opacity: 1
  };
}

function drawShootingStar() {
  if (!shootingStar) return;
  ctx.beginPath();
  ctx.moveTo(shootingStar.x, shootingStar.y);
  ctx.lineTo(shootingStar.x - shootingStar.len, shootingStar.y - shootingStar.len * 0.4);
  const gradient = ctx.createLinearGradient(
    shootingStar.x, shootingStar.y,
    shootingStar.x - shootingStar.len, shootingStar.y - shootingStar.len * 0.4
  );
  gradient.addColorStop(0, `rgba(255,255,255,${shootingStar.opacity})`);
  gradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  shootingStar.x += shootingStar.speed;
  shootingStar.y += shootingStar.speed * 0.4;
  shootingStar.opacity -= 0.015;

  if (shootingStar.opacity <= 0) shootingStar = null;
}

setInterval(createShootingStar, 4000);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNebulas();
  drawStars();
  drawShootingStar();
  requestAnimationFrame(animate);
}

initStars();
animate();