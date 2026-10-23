export const money = (amount) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
export function renderSummary(transactions) {
  const income =
    transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Math.round(Number(item.amount) * 100), 0) / 100;
  const expense =
    transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Math.round(Number(item.amount) * 100), 0) / 100;
  const container = document.querySelector('#summary');
  container.replaceChildren();
  [
    ['Доходы', income, 'income'],
    ['Расходы', expense, 'expense'],
    ['Баланс', income - expense, 'balance'],
  ].forEach(([title, total, type]) => {
    const card = document.createElement('article');
    card.className = `panel ${type}`;
    const name = document.createElement('h2');
    name.textContent = title;
    const value = document.createElement('p');
    value.textContent = money(total);
    card.append(name, value);
    container.append(card);
  });
}
export function renderTransactions(transactions, categories, onEdit, onDelete) {
  const list = document.querySelector('#transactions');
  list.replaceChildren();
  [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((item) => {
      const li = document.createElement('li');
      const info = document.createElement('span');
      info.className = 'text';
      const name =
        categories.find((category) => String(category.id) === String(item.categoryId))?.name ??
        'Неизвестная категория';
      info.textContent = `${item.date} · ${name}${item.comment ? ' · ' + item.comment : ''}`;
      const amount = document.createElement('strong');
      amount.className = item.type;
      amount.textContent = `${item.type === 'income' ? '+' : '−'}${money(item.amount)}`;
      const edit = document.createElement('button');
      edit.className = 'secondary';
      edit.textContent = 'Изменить';
      edit.addEventListener('click', () => onEdit(item));
      const remove = document.createElement('button');
      remove.className = 'secondary';
      remove.textContent = 'Удалить';
      remove.addEventListener('click', () => onDelete(item.id));
      li.append(info, amount, edit, remove);
      list.append(li);
    });
  document.querySelector('#empty').hidden = transactions.length > 0;
  document.querySelector('#visible-count').textContent = `(${transactions.length})`;
}
export function populateCategories(select, categories, type, all = false) {
  const current = select.value;
  select.replaceChildren();
  if (all) {
    const option = new Option('Все', 'all');
    select.add(option);
  }
  categories
    .filter((item) => !type || item.type === type)
    .forEach((item) => select.add(new Option(item.name, String(item.id))));
  if ([...select.options].some((option) => option.value === current)) select.value = current;
}
