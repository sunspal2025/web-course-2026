/** Задача приходит через props; её состояние хранит только App. */
export default function TodoItem({task,onToggle,onDelete}) {
  return <li className={task.completed ? 'completed' : ''}><input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} aria-label={`Выполнено: ${task.text}`}/><span className="text">{task.text}</span><button className="secondary" onClick={() => onDelete(task.id)} aria-label={`Удалить: ${task.text}`}>Удалить</button></li>;
}
