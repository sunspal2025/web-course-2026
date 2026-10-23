import {useState} from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Filters from './components/Filters';
import Stats from './components/Stats';
export default function App() {
  const [tasks,setTasks] = useState([]); const [filter,setFilter] = useState('all');
  const visible = tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed));
  function add(text) { setTasks(previous => [...previous,{id:crypto.randomUUID(),text,completed:false,createdAt:Date.now()}]); }
  function toggle(id) { setTasks(previous => previous.map(task => task.id === id ? {...task,completed:!task.completed} : task)); }
  function remove(id) { setTasks(previous => previous.filter(task => task.id !== id)); }
  return <><header className="topbar"><a href="../../">ВП / Практикум</a><span>Работа 10 · React</span></header><main><p className="eyebrow">React / Компоненты и состояние</p><h1>Освободите место<br/>для главного.</h1><p className="lead">Задачи, которые помогают держать фокус.</p><section className="panel" aria-label="Задачи"><TodoForm onAdd={add}/><Filters filter={filter} onFilter={setFilter}/><Stats tasks={tasks}/><TodoList tasks={visible} onToggle={toggle} onDelete={remove}/></section></main><footer className="page-footer">Пальцев Вячеслав · Группа 11</footer></>;
}
