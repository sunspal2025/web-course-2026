import TodoItem from './TodoItem';
export default function TodoList({ tasks, onToggle, onDelete }) {
  return tasks.length ? (
    <ul className="list">
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  ) : (
    <p className="empty">В этом списке пока нет задач.</p>
  );
}
