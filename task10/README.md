# Todo на React: компоненты

Из корня репозитория: `npm ci`, затем `npm run dev --workspace=task10`. Открыть http://localhost:5173/source.html. Production-сборка: `npm run build --workspace=task10`.

App хранит массив в useState, дочерние компоненты получают данные и обработчики через props. key — UUID задачи, TodoItem не дублирует состояние. Версия с сортировкой и сохранением — task11.

Для Pages готовая сборка лежит в published/. Исходная HTML-точка входа Vite — source.html; index.html перенаправляет на опубликованную версию. Обновление сборок: npm run publish:static из корня.
