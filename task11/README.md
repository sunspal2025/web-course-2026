# Todo на React: сортировка и useEffect

Из корня: `npm ci`, `npm run dev --workspace=task11`. Открыть http://localhost:5174/source.html. Сборка: `npm run build --workspace=task11`.

Компоненты переиспользуются из task10, состояние находится в App. useState с ленивым инициализатором читает сохранённый список до первого render, useEffect записывает изменения. Повреждённый JSON обрабатывается; сортировка работает с копией массива и не меняет состояние напрямую. Тесты логики и компонентов — task14.

Для Pages готовая сборка лежит в published/. Исходная HTML-точка входа Vite — source.html; index.html перенаправляет на опубликованную версию. Обновление сборок: npm run publish:static из корня.
