import { test, expect } from 'vitest';
import { selectTasks, readTasks } from '../task11/src/logic';
const tasks = [
  { id: 'a', text: 'Яблоко', completed: false, createdAt: 1 },
  { id: 'b', text: 'Арбуз', completed: true, createdAt: 2 },
];
test('алфавитная сортировка не меняет исходный массив', () => {
  expect(selectTasks(tasks, 'all', 'alpha').map((t) => t.id)).toEqual(['b', 'a']);
  expect(tasks[0].id).toBe('a');
});
test('сначала новые и сначала старые', () => {
  expect(selectTasks(tasks, 'all', 'newest')[0].id).toBe('b');
  expect(selectTasks(tasks, 'all', 'oldest')[0].id).toBe('a');
});
test('фильтр завершённых', () =>
  expect(selectTasks(tasks, 'completed').map((t) => t.id)).toEqual(['b']));
test('фильтр активных', () => expect(selectTasks(tasks, 'active').map((t) => t.id)).toEqual(['a']));
test('повреждённое хранилище', () => expect(readTasks({ getItem: () => 'broken' })).toEqual([]));
test('неверная структура хранилища', () =>
  expect(readTasks({ getItem: () => '{"foo":1}' })).toEqual([]));
test('дубликаты id и неверные задачи отсекаются', () =>
  expect(
    readTasks({ getItem: () => JSON.stringify([...tasks, tasks[0], { id: 'bad', text: 42 }]) }),
  ).toEqual(tasks));
