const base = 'http://localhost:3001';
async function request(path, options = {}) {
  try {
    const response = await fetch(`${base}${path}`, { ...options, headers: {'Content-Type':'application/json'}, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Сервер вернул HTTP ${response.status}`);
    return response.status === 204 ? null : await response.json();
  } catch (error) { throw new Error(`Не удалось выполнить запрос. Запустите json-server на порту 3001. ${error.message}`); }
}
export const getTransactions = () => request('/transactions');
export const getCategories = () => request('/categories');
export const addTransaction = data => request('/transactions', {method:'POST',body:JSON.stringify(data)});
export const updateTransaction = (id,data) => request(`/transactions/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(data)});
export const deleteTransaction = id => request(`/transactions/${encodeURIComponent(id)}`,{method:'DELETE'});
export const addCategory = data => request('/categories',{method:'POST',body:JSON.stringify(data)});
