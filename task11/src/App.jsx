import { useState, useEffect } from 'react';
import TodoForm from '../../task10/src/components/TodoForm';
import TodoList from '../../task10/src/components/TodoList';
import Filters from '../../task10/src/components/Filters';
import Stats from '../../task10/src/components/Stats';
import { selectTasks, readTasks } from './logic';
export default function App() {
  const [tasks, setTasks] = useState(() => readTasks());
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem('react-tasks', JSON.stringify(tasks));
      setStorageError('');
    } catch {
      setStorageError('Не удалось сохранить задачи в браузере.');
    }
  }, [tasks]);
  function add(text) {
    setTasks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
    ]);
  }
  function toggle(id) {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }
  function remove(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }
  return (
    <>
      <header className="topbar">
        <a href="../../">ВП / Практикум</a>
        <span>Работа 11 · React + useEffect</span>
      </header>
      <main>
        <p className="eyebrow">Фокус / Сохранение и порядок</p>
        <h1>
          Ваш план.
          <br />В вашем порядке.
        </h1>
        <p className="lead">Задачи остаются в браузере после перезагрузки.</p>
        <section className="panel" aria-label="Задачи">
          <TodoForm onAdd={add} />
          <p className="error" role="alert">
            {storageError}
          </p>
          <div className="row">
            <Filters filter={filter} onFilter={setFilter} />
            <label>
              Сортировка
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="alpha">По алфавиту</option>
              </select>
            </label>
          </div>
          <Stats tasks={tasks} />
          <TodoList tasks={selectTasks(tasks, filter, sort)} onToggle={toggle} onDelete={remove} />
        </section>
      </main>
      <footer className="page-footer">Пальцев Вячеслав · Группа 11</footer>
    </>
  );
}
