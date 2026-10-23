'use strict';
function generateSecret() {
  const digits = [...'0123456789'];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 4).join('');
}
function validateGuess(value) { return typeof value === 'string' && /^\d{4}$/.test(value) && new Set(value).size === 4; }
function countBullsAndCows(secret, guess) {
  if (!validateGuess(secret) || !validateGuess(guess)) throw new TypeError('Ожидаются четыре разные цифры.');
  let bulls = 0; let cows = 0;
  [...guess].forEach((digit, index) => { if (secret[index] === digit) bulls++; else if (secret.includes(digit)) cows++; });
  return {bulls, cows};
}
let secret = ''; let attempts = []; let won = false;
function render() {
  const list = document.querySelector('#history'); list.replaceChildren();
  attempts.forEach((attempt, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${attempt.guess} → Быки: ${attempt.bulls}, Коровы: ${attempt.cows}`; list.append(li);
  });
  document.querySelector('#count').textContent = `Попыток: ${attempts.length}`;
  document.querySelector('#empty').hidden = attempts.length > 0;
  document.querySelector('#guess').disabled = won; document.querySelector('#check').disabled = won;
}
function startGame() {
  secret = generateSecret(); attempts = []; won = false;
  document.querySelector('#guess').value = '';
  document.querySelector('#guess').removeAttribute('aria-invalid');
  document.querySelector('#status').textContent = 'Код загадан. Удачи!'; render(); document.querySelector('#guess').focus();
}
if (typeof document !== 'undefined') {
  document.querySelector('#guess-form').addEventListener('submit', event => {
    event.preventDefault(); if (won) return;
    const input = document.querySelector('#guess'); const guess = input.value;
    if (!validateGuess(guess)) { input.setAttribute('aria-invalid','true'); document.querySelector('#status').textContent = 'Введите ровно четыре разные цифры без пробелов.'; return; }
    input.removeAttribute('aria-invalid');
    const result = countBullsAndCows(secret, guess); attempts.push({guess, ...result}); won = result.bulls === 4;
    document.querySelector('#status').textContent = won ? `Победа! Угадано за ${attempts.length} попыток` : 'Попробуйте ещё один вариант.';
    input.value = ''; render();
  });
  document.querySelector('#new-game').addEventListener('click', startGame); startGame();
}
// CommonJS-экспорт позволяет Jest проверять те же функции, которые использует браузер.
if (typeof module !== 'undefined') module.exports = {generateSecret, validateGuess, countBullsAndCows};
