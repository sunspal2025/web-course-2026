'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { request } from '../lib/api';
import { money } from '../lib/money';
export default function TransactionDetail({ id }) {
  const [item, setItem] = useState(null),
    [category, setCategory] = useState(''),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await request(`/transactions/${encodeURIComponent(id)}`);
        const groups = await request('/categories');
        if (!cancelled) {
          setItem(data);
          setCategory(
            groups.find((c) => String(c.id) === String(data.categoryId))?.name ||
              'Неизвестная категория',
          );
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);
  return (
    <section className="panel">
      {loading && <p role="status">Загрузка операции…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && item && (
        <>
          <p className="eyebrow">
            {item.type === 'income' ? 'Доход' : 'Расход'} / {category}
          </p>
          <h2 className={item.type}>{money(item.amount)}</h2>
          <p>
            Дата: <time dateTime={item.date}>{item.date}</time>
          </p>
          <p>{item.comment || 'Без комментария'}</p>
          <Link href={`/add?id=${item.id}`}>Редактировать операцию ↗</Link>
        </>
      )}
      <p>
        <Link href="/">← К операциям</Link>
      </p>
    </section>
  );
}
