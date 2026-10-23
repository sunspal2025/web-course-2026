export default function Filters({ filter, onFilter }) {
  return (
    <nav className="filters" aria-label="Фильтр задач">
      {[
        ['all', 'Все'],
        ['active', 'Активные'],
        ['completed', 'Завершённые'],
      ].map(([value, label]) => (
        <button key={value} aria-pressed={filter === value} onClick={() => onFilter(value)}>
          {label}
        </button>
      ))}
    </nav>
  );
}
