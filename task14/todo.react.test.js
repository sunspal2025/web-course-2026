import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../task10/src/components/TodoForm';
import TodoItem from '../task10/src/components/TodoItem';
import App from '../task10/src/App';
describe('React Todo: пользовательские действия', () => {
  test('форма содержит поле с меткой и кнопку', () => {
    render(React.createElement(TodoForm, { onAdd: vi.fn() }));
    expect(screen.getByRole('textbox', { name: 'Новая задача' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeVisible();
  });
  test('добавление передаёт очищенный текст и очищает поле', async () => {
    const user = userEvent.setup(),
      onAdd = vi.fn();
    render(React.createElement(TodoForm, { onAdd }));
    await user.type(screen.getByRole('textbox'), '  Сделать лабу  ');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    expect(onAdd).toHaveBeenCalledExactlyOnceWith('Сделать лабу');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
  test('пустой ввод не вызывает обработчик', async () => {
    const user = userEvent.setup(),
      onAdd = vi.fn();
    render(React.createElement(TodoForm, { onAdd }));
    await user.type(screen.getByRole('textbox'), '   {Enter}');
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Введите текст');
  });
  test('Enter добавляет задачу', async () => {
    const user = userEvent.setup(),
      onAdd = vi.fn();
    render(React.createElement(TodoForm, { onAdd }));
    await user.type(screen.getByRole('textbox'), 'Проверить код{Enter}');
    expect(onAdd).toHaveBeenCalledWith('Проверить код');
  });
  test('удаление вызывает onDelete с id', async () => {
    const user = userEvent.setup(),
      onDelete = vi.fn();
    render(
      React.createElement(TodoItem, {
        task: { id: 'abc', text: 'Тест', completed: false },
        onToggle: vi.fn(),
        onDelete,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Удалить: Тест' }));
    expect(onDelete).toHaveBeenCalledExactlyOnceWith('abc');
  });
  test('чекбокс вызывает onToggle с id', async () => {
    const user = userEvent.setup(),
      onToggle = vi.fn();
    render(
      React.createElement(TodoItem, {
        task: { id: 'abc', text: 'Тест', completed: false },
        onToggle,
        onDelete: vi.fn(),
      }),
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('abc');
  });
  test('App добавляет, завершает, фильтрует и удаляет задачу', async () => {
    const user = userEvent.setup();
    render(React.createElement(App));
    await user.type(screen.getByRole('textbox'), 'Проверить приложение{Enter}');
    expect(screen.getByText('Проверить приложение')).toBeVisible();
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByText('Осталось: 0, Выполнено: 1')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Активные' }));
    expect(screen.queryByText('Проверить приложение')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Завершённые' }));
    await user.click(screen.getByRole('button', { name: 'Удалить: Проверить приложение' }));
    expect(screen.queryByText('Проверить приложение')).not.toBeInTheDocument();
  });
});
