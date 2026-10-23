'use strict';
const pads = [...document.querySelectorAll('[data-pad]')];
const status = document.querySelector('#status');
let sequence = [];
let playerIndex = 0;
let phase = 'idle';
let timers = new Set();
let audio;
function schedule(callback, delay) {
  const id = setTimeout(() => {
    timers.delete(id);
    callback();
  }, delay);
  timers.add(id);
}
function clearTimers() {
  timers.forEach(clearTimeout);
  timers.clear();
  pads.forEach((pad) => pad.classList.remove('active'));
}
function setPhase(value) {
  phase = value;
  pads.forEach((pad) => {
    pad.disabled = phase !== 'input';
  });
}
function tone(index) {
  if (!document.querySelector('#sound').checked) return;
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = [261.63, 329.63, 392, 523.25][index];
    gain.gain.setValueAtTime(0.07, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.25);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.25);
  } catch {
    /* Отсутствие аудио не мешает игре. */
  }
}
function flash(index, duration) {
  pads[index].classList.add('active');
  tone(index);
  schedule(() => pads[index].classList.remove('active'), duration);
}
function playSequence(index = 0) {
  if (phase !== 'showing') return;
  flash(sequence[index], 500);
  schedule(() => {
    if (index + 1 < sequence.length) playSequence(index + 1);
    else {
      playerIndex = 0;
      setPhase('input');
      status.textContent = 'Ваш ход. Повторите последовательность.';
    }
  }, 780);
}
function nextRound() {
  setPhase('showing');
  sequence.push(Math.floor(Math.random() * 4));
  document.querySelector('#level').textContent = `Уровень: ${sequence.length}`;
  status.textContent = 'Смотрите и запоминайте…';
  schedule(() => playSequence(), 500);
}
function startGame() {
  clearTimers();
  sequence = [];
  playerIndex = 0;
  nextRound();
}
pads.forEach((pad, index) =>
  pad.addEventListener('click', () => {
    if (phase !== 'input') return;
    if (sequence[playerIndex] !== index) {
      clearTimers();
      setPhase('over');
      status.textContent = `Ошибка. Вы дошли до уровня ${sequence.length}. Нажмите «Старт», чтобы сыграть снова.`;
      return;
    }
    flash(index, 180);
    playerIndex++;
    if (playerIndex === sequence.length) {
      setPhase('between');
      status.textContent = 'Верно! Следующий раунд…';
      schedule(nextRound, 750);
    }
  }),
);
document.querySelector('#start').addEventListener('click', startGame);
window.addEventListener('pagehide', () => {
  clearTimers();
  setPhase('idle');
});
