import { Suspense } from 'react';
import TransactionForm from '../../components/TransactionForm';
export default function AddPage() {
  return (
    <main>
      <p className="eyebrow">Запись / Доход или расход</p>
      <h1>
        Добавить
        <br />
        ясности.
      </h1>
      <Suspense fallback={<p>Загрузка формы…</p>}>
        <TransactionForm />
      </Suspense>
    </main>
  );
}
