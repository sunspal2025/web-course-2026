'use client';
import { useFinance } from './FinanceProvider';
export default function Connection() {
  const { loading, error, load } = useFinance();
  return (
    <>
      {loading && <p role="status">Загружаем операции…</p>}
      {error && (
        <section className="panel connection-state">
          <p className="eyebrow">Подключение к данным</p>
          <h2>Сервер операций не подключён.</h2>
          <p role="alert">
            Для просмотра и изменения финансовых данных нужен локальный json-server. Интерфейс
            опубликован, а данные остаются на вашем компьютере.
          </p>
          <button onClick={load}>Повторить подключение</button>
          <details>
            <summary>Как запустить приложение с данными</summary>
            <p>В корне репозитория запустите API и Next.js в двух терминалах:</p>
            <code>npm run server --workspace=task8</code>
            <code>npm run dev --workspace=task12</code>
            <p>Откройте http://localhost:3000. На Vercel локальный API не публикуется.</p>
            <p className="muted">Техническая причина: {error}</p>
          </details>
        </section>
      )}
    </>
  );
}
