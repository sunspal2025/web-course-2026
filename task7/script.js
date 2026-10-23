'use strict';
let posts = [];
let page = 1;
let loading = false;
let exhausted = false;
let failed = false;
let query = '';
let debounce;
const status = document.querySelector('#status');
const sentinel = document.querySelector('#sentinel');
function render() {
  const list = document.querySelector('#posts');
  list.replaceChildren();
  const visible = posts.filter((post) => post.title.toLocaleLowerCase().includes(query));
  visible.forEach((post) => {
    const article = document.createElement('article');
    article.className = 'panel';
    const author = document.createElement('p');
    author.className = 'eyebrow';
    author.textContent = `Запись ${post.id} / Автор ${post.userId}`;
    const title = document.createElement('h2');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.textContent = post.body;
    article.append(author, title, body);
    list.append(article);
  });
  document.querySelector('#empty').hidden = visible.length > 0 || !posts.length;
  document.querySelector('#count').textContent =
    `Загружено: ${posts.length} · Показано: ${visible.length}`;
}
async function loadMore() {
  if (loading || exhausted || failed || query) return;
  loading = true;
  status.textContent = 'Загрузка…';
  document.querySelector('#retry').hidden = true;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Неверный формат ответа');
    posts.push(...batch);
    page++;
    exhausted = batch.length < 10 || posts.length >= 100;
    status.textContent = exhausted ? 'Больше постов нет' : '';
    render();
  } catch {
    failed = true;
    status.textContent = 'Не удалось загрузить посты. Проверьте соединение и повторите попытку.';
    document.querySelector('#retry').hidden = false;
  } finally {
    loading = false;
  }
  // Если после фильтрации страница короткая, дозагружаем следующую порцию без нового события observer.
  if (!failed && !exhausted && sentinel.getBoundingClientRect().top < window.innerHeight + 200)
    setTimeout(loadMore, 100);
}
const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMore();
  },
  { rootMargin: '200px' },
);
observer.observe(sentinel);
document.querySelector('#retry').addEventListener('click', () => {
  failed = false;
  loadMore();
});
document.querySelector('#search').addEventListener('input', (event) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    query = event.target.value.trim().toLocaleLowerCase();
    render();
    if (!query && sentinel.getBoundingClientRect().top < window.innerHeight + 200) loadMore();
  }, 300);
});
window.addEventListener('pagehide', () => {
  observer.disconnect();
  clearTimeout(debounce);
});
loadMore();
