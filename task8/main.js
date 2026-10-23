import * as api from './api.js';
import {renderSummary,renderTransactions,populateCategories} from './ui.js';
const enhanced = document.body.dataset.enhanced === 'true';
const form = document.querySelector('#transaction-form');
const filters = document.querySelector('#filters');
const message = document.querySelector('#message');
let transactions = [], categories = [], editingId = null, busy = false, connected = false;
const defaults = {type:'all',category:'all',from:'',to:'',theme:'dark'};
let settings = {...defaults};
if (enhanced) {
  try { const stored = JSON.parse(localStorage.getItem('zen-settings')); if (stored && typeof stored === 'object') for (const key of Object.keys(defaults)) if (typeof stored[key] === 'string') settings[key] = stored[key]; } catch { /* Настройки необязательны. */ }
  document.querySelector('#advanced').hidden = false;
  Object.keys(defaults).forEach(key => { filters.elements[key].value = settings[key]; });
  document.documentElement.dataset.theme = settings.theme;
}
function render() {
  const type = form.elements.type.value;
  populateCategories(form.elements.categoryId,categories,type);
  if (enhanced) { populateCategories(filters.elements.category,categories,null,true); filters.elements.category.value = settings.category; }
  const invalidRange = settings.from && settings.to && settings.from > settings.to;
  document.querySelector('#filter-error').textContent = invalidRange ? 'Дата «с» должна быть не позже даты «по».' : '';
  const visible = transactions.filter(item => !enhanced || ((!invalidRange) && (settings.type === 'all' || item.type === settings.type) && (settings.category === 'all' || String(item.categoryId) === settings.category) && (!settings.from || item.date >= settings.from) && (!settings.to || item.date <= settings.to)));
  renderSummary(transactions); renderTransactions(visible,categories,editTransaction,removeTransaction);
  document.querySelector('#save').disabled = busy || !connected;
}
function today() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
function resetForm() { editingId = null; form.reset(); form.elements.date.value = today(); document.querySelector('#form-title').textContent = 'Новая операция'; document.querySelector('#save').textContent = 'Добавить операцию'; document.querySelector('#cancel').hidden = true; document.querySelector('#form-error').textContent = ''; [...form.elements].forEach(field => field.removeAttribute('aria-invalid')); render(); }
async function load() {
  if (busy) return; busy = true; message.textContent = 'Загрузка…'; render();
  try {
    [transactions,categories] = await Promise.all([api.getTransactions(),api.getCategories()]); connected = true; message.textContent = '';
    document.querySelector('#connection').textContent = 'Подключено · данные хранятся на json-server';
  } catch (error) { connected = false; message.textContent = error.message; document.querySelector('#connection').textContent = 'Сервер недоступен. Данные не заменяются демонстрационными.'; }
  finally { busy = false; render(); }
}
function editTransaction(item) {
  if (busy) return; editingId = item.id; form.elements.type.value = item.type; populateCategories(form.elements.categoryId,categories,item.type);
  ['amount','date','comment','categoryId'].forEach(key => { form.elements[key].value = item[key] ?? ''; });
  document.querySelector('#form-title').textContent = 'Редактирование операции'; document.querySelector('#save').textContent = 'Сохранить'; document.querySelector('#cancel').hidden = false;
  form.elements.amount.focus();
}
async function removeTransaction(id) {
  if (busy) return; busy = true; render();
  try { await api.deleteTransaction(id); transactions = transactions.filter(item => item.id !== id); if (editingId === id) resetForm(); message.textContent = 'Операция удалена.'; }
  catch (error) { message.textContent = error.message; }
  finally { busy = false; render(); }
}
form.addEventListener('submit',async event => {
  event.preventDefault(); if (busy || !connected) return;
  const amount = Number(form.elements.amount.value), type = form.elements.type.value, categoryId = form.elements.categoryId.value, date = form.elements.date.value;
  const validCategory = categories.some(item => String(item.id) === categoryId && item.type === type);
  const errors = {amount: !Number.isFinite(amount) || Math.round(amount*100) <= 0, categoryId: !validCategory, date: !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)};
  Object.entries(errors).forEach(([key,invalid]) => form.elements[key].setAttribute('aria-invalid',String(invalid)));
  if (Object.values(errors).some(Boolean)) { document.querySelector('#form-error').textContent = 'Укажите положительную сумму, категорию и дату.'; return; }
  document.querySelector('#form-error').textContent = ''; const data = {amount:Math.round(amount*100)/100,type,categoryId,date,comment:form.elements.comment.value.trim()};
  busy = true; render();
  try { if (editingId !== null) { const updated = await api.updateTransaction(editingId,data); transactions = transactions.map(item => item.id === editingId ? updated : item); } else transactions.push(await api.addTransaction(data)); resetForm(); message.textContent = 'Операция сохранена.'; }
  catch (error) { message.textContent = error.message; }
  finally { busy = false; render(); }
});
form.elements.type.addEventListener('change', () => populateCategories(form.elements.categoryId,categories,form.elements.type.value));
document.querySelector('#cancel').addEventListener('click',resetForm);
document.querySelector('#reload').addEventListener('click',load);
if (enhanced) {
  filters.addEventListener('submit',event => event.preventDefault());
  filters.addEventListener('change',() => { settings = Object.fromEntries(new FormData(filters)); document.documentElement.dataset.theme = settings.theme; try { localStorage.setItem('zen-settings',JSON.stringify(settings)); } catch { message.textContent = 'Браузер не разрешил сохранить настройки.'; } render(); });
  document.querySelector('#reset').addEventListener('click',() => { const theme = settings.theme; settings = {...defaults,theme}; Object.keys(settings).forEach(key => { filters.elements[key].value = settings[key]; }); filters.dispatchEvent(new Event('change')); });
  document.querySelector('#category-form').addEventListener('submit',async event => {
    event.preventDefault(); if (busy || !connected) return; const categoryForm = event.target; const name = categoryForm.elements.name.value.trim(); if (!name) { message.textContent = 'Введите название категории.'; return; }
    busy = true;
    try { const category = await api.addCategory({name,type:categoryForm.elements.type.value}); categories.push(category); categoryForm.reset(); message.textContent = 'Категория создана.'; }
    catch (error) { message.textContent = error.message; }
    finally { busy = false; render(); }
  });
}
resetForm(); load();
