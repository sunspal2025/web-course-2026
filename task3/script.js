'use strict';
let tasks = [];
let nextId = 1;
let currentFilter = 'all';
const form = document.querySelector('#todo-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#tasks');
function render() {
  list.replaceChildren();
  const visible = tasks.filter(
    (task) =>
      currentFilter === 'all' || (currentFilter === 'completed' ? task.completed : !task.completed),
  );
  visible.forEach((task) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Выполнено: ${task.text}`);
    checkbox.addEventListener('change', () => {
      tasks = tasks.map((item) =>
        item.id === task.id ? { ...item, completed: checkbox.checked } : item,
      );
      render();
    });
    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = task.text;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary';
    remove.textContent = 'Удалить';
    remove.setAttribute('aria-label', `Удалить: ${task.text}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      render();
    });
    li.append(checkbox, text, remove);
    list.append(li);
  });
  const completed = tasks.filter((task) => task.completed).length;
  document.querySelector('#stats').textContent =
    `Осталось: ${tasks.length - completed}, Выполнено: ${completed}`;
  const empty = document.querySelector('#empty');
  empty.hidden = visible.length > 0;
  empty.textContent = tasks.length
    ? 'В этом фильтре задач нет.'
    : 'Пока пусто. Добавьте первую задачу.';
  document
    .querySelectorAll('[data-filter]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.filter === currentFilter)),
    );
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  document.querySelector('#error').textContent = text ? '' : 'Введите текст задачи.';
  input.setAttribute('aria-invalid', String(!text));
  if (!text) {
    input.focus();
    return;
  }
  tasks.push({ id: nextId++, text, completed: false });
  input.value = '';
  render();
  input.focus();
});
document.querySelectorAll('[data-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    render();
  }),
);
render();
