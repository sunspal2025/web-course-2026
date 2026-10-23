export function selectTasks(tasks,filter = 'all',sort = 'newest') {
  const selected = tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed));
  return [...selected].sort((a,b) => sort === 'alpha' ? a.text.localeCompare(b.text,'ru') : sort === 'oldest' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
}
export function readTasks(storage = localStorage) {
  try {
    const data = JSON.parse(storage.getItem('react-tasks') ?? '[]');
    if (!Array.isArray(data)) return [];
    const ids = new Set();
    return data.filter(task => task && typeof task.id === 'string' && !ids.has(task.id) && ids.add(task.id) && typeof task.text === 'string' && task.text.trim() && typeof task.completed === 'boolean' && Number.isFinite(task.createdAt));
  } catch { return []; }
}
