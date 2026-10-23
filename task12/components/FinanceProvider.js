'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { request } from '../lib/api';
const FinanceContext = createContext(null);
export function useFinance() {
  return useContext(FinanceContext);
}
export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]),
    [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [items, groups] = await Promise.all([request('/transactions'), request('/categories')]);
      setTransactions(items);
      setCategories(groups);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function save(data, id) {
    const item = await request(
      id == null ? '/transactions' : `/transactions/${encodeURIComponent(id)}`,
      { method: id == null ? 'POST' : 'PATCH', body: JSON.stringify(data) },
    );
    setTransactions((previous) =>
      id == null
        ? [...previous, item]
        : previous.map((old) => (String(old.id) === String(id) ? item : old)),
    );
    return item;
  }
  async function remove(id) {
    await request(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setTransactions((previous) => previous.filter((item) => String(item.id) !== String(id)));
  }
  return (
    <FinanceContext.Provider
      value={{ transactions, categories, loading, error, load, save, remove }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
