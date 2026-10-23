export default function Stats({ tasks }) {
  const completed = tasks.filter((task) => task.completed).length;
  return (
    <p className="stats" aria-live="polite">
      Осталось: {tasks.length - completed}, Выполнено: {completed}
    </p>
  );
}
