'use strict';
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const size = 20;
const cell = 20;
const moveInterval = 150;
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
let snake,
  direction,
  pendingDirection,
  apple,
  score,
  gameOver,
  paused,
  turnQueued,
  lastTime = null,
  accumulator = 0,
  frame;
function spawnApple() {
  const free = [];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (!snake.some((segment) => segment.x === x && segment.y === y)) free.push({ x, y });
  return free.length ? free[Math.floor(Math.random() * free.length)] : null;
}
function checkCollision(head, body) {
  return (
    head.x < 0 ||
    head.x >= size ||
    head.y < 0 ||
    head.y >= size ||
    body.some((segment) => segment.x === head.x && segment.y === head.y)
  );
}
function finish(message) {
  gameOver = true;
  document.querySelector('#status').textContent = `${message} Итоговый счёт: ${score}.`;
}
function update() {
  direction = pendingDirection;
  turnQueued = false;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  const eating = apple && head.x === apple.x && head.y === apple.y;
  // Хвост освобождает клетку при обычном ходе, поэтому исключаем его из проверки.
  if (checkCollision(head, eating ? snake : snake.slice(0, -1))) {
    finish('Игра окончена.');
    return;
  }
  snake.unshift(head);
  if (eating) {
    score++;
    apple = spawnApple();
    if (!apple) finish('Победа! Поле заполнено.');
  } else snake.pop();
  document.querySelector('#score').textContent = `Счёт: ${score}`;
}
function draw() {
  ctx.fillStyle = '#f4f7fc';
  ctx.fillRect(0, 0, 400, 400);
  ctx.strokeStyle = '#e2e8f1';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(400, i * cell);
    ctx.stroke();
  }
  if (apple) {
    ctx.fillStyle = '#d95030';
    ctx.beginPath();
    ctx.arc(apple.x * cell + 10, apple.y * cell + 10, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#0066cc' : '#73a6d9';
    ctx.fillRect(segment.x * cell + 2, segment.y * cell + 2, cell - 4, cell - 4);
  });
}
function loop(time) {
  if (lastTime === null) lastTime = time;
  accumulator += Math.min(time - lastTime, 300);
  lastTime = time;
  if (!gameOver && !paused)
    while (accumulator >= moveInterval && !gameOver) {
      update();
      accumulator -= moveInterval;
    }
  else accumulator = 0;
  draw();
  if (!gameOver) frame = requestAnimationFrame(loop);
}
function changeDirection(name) {
  const next = directions[name];
  if (!next || gameOver || paused || turnQueued) return;
  if (next.x === -direction.x && next.y === -direction.y) return;
  pendingDirection = next;
  turnQueued = true;
}
function startGame() {
  cancelAnimationFrame(frame);
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];
  direction = directions.right;
  pendingDirection = direction;
  score = 0;
  gameOver = false;
  paused = false;
  turnQueued = false;
  apple = spawnApple();
  lastTime = null;
  accumulator = 0;
  document.querySelector('#score').textContent = 'Счёт: 0';
  document.querySelector('#status').textContent = 'Игра идёт.';
  document.querySelector('#pause').textContent = 'Пауза';
  draw();
  frame = requestAnimationFrame(loop);
}
window.addEventListener('keydown', (event) => {
  const name = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[
    event.key
  ];
  if (name) {
    event.preventDefault();
    changeDirection(name);
  }
});
document
  .querySelectorAll('[data-direction]')
  .forEach((button) =>
    button.addEventListener('click', () => changeDirection(button.dataset.direction)),
  );
document.querySelector('#restart').addEventListener('click', startGame);
document.querySelector('#pause').addEventListener('click', () => {
  if (gameOver) return;
  paused = !paused;
  document.querySelector('#pause').textContent = paused ? 'Продолжить' : 'Пауза';
  document.querySelector('#status').textContent = paused ? 'Пауза.' : 'Игра идёт.';
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !gameOver) {
    paused = true;
    document.querySelector('#pause').textContent = 'Продолжить';
    document.querySelector('#status').textContent = 'Пауза.';
  }
  lastTime = null;
  accumulator = 0;
});
window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
startGame();
