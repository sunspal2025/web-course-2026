# JavaScript и веб-разработка · 2026

Пальцев Вячеслав Витальевич · Группа 11

[Каталог работ](https://sunspal2025.github.io/web-course-2026/) · [Репозиторий](https://github.com/sunspal2025/web-course-2026)

## Работы

| Папка | Работа | Как проверить |
| --- | --- | --- |
| [task0/](task0/README.md) | Организация репозитория | [Открыть](https://sunspal2025.github.io/web-course-2026/task0/) |
| [task1/](task1/README.md) | Семантическое резюме | [Открыть](https://sunspal2025.github.io/web-course-2026/task1/) |
| [task2/](task2/README.md) | Адаптивный лендинг | [Открыть](https://sunspal2025.github.io/web-course-2026/task2/) |
| [task3/](task3/README.md) | Todo на JavaScript | [Открыть](https://sunspal2025.github.io/web-course-2026/task3/) |
| [task4/](task4/README.md) | Быки и коровы | [Открыть](https://sunspal2025.github.io/web-course-2026/task4/) |
| [task5/](task5/README.md) | Simon | [Открыть](https://sunspal2025.github.io/web-course-2026/task5/) |
| [task6/](task6/README.md) | Змейка на Canvas | [Открыть](https://sunspal2025.github.io/web-course-2026/task6/) |
| [task7/](task7/README.md) | Бесконечная лента | [Открыть](https://sunspal2025.github.io/web-course-2026/task7/) |
| [task8/](task8/README.md) | Zen-Money: CRUD | [Открыть](https://sunspal2025.github.io/web-course-2026/task8/); для CRUD нужен API :3001 |
| [task9/](task9/README.md) | Zen-Money: фильтры и настройки | [Открыть](https://sunspal2025.github.io/web-course-2026/task9/); для CRUD нужен API :3001 |
| [task10/](task10/README.md) | Todo на React | [Открыть](https://sunspal2025.github.io/web-course-2026/task10/) |
| [task11/](task11/README.md) | React: сортировка и useEffect | [Открыть](https://sunspal2025.github.io/web-course-2026/task11/) |
| [task12/](task12/README.md) | Zen-Money на Next.js | Next.js: локально :3000, [инструкция](task12/README.md) |
| [task13/](task13/README.md) | Динамические маршруты и деплой | Next.js: локально :3000, [инструкция](task12/README.md) |
| [task14/](task14/README.md) | Jest и React Testing Library | `npm test`, [результат](task14/README.md) |
| [task15/](task15/README.md) | Todo на Angular | [Открыть](https://sunspal2025.github.io/web-course-2026/task15/) |
| [task16/](task16/README.md) | Защита итогового проекта | [Открыть](https://sunspal2025.github.io/web-course-2026/task16/) |

## Установка и запуск

Требуется Node.js 22.12+ (проверено на 24.22.1), npm и Python 3 для простого HTTP-сервера. Все команды ниже выполняются из корня клонированного репозитория.

```bash
npm ci
npm test
npm run build
```

Обычные HTML-работы: `npm run serve`, открыть http://localhost:8080. Работы 0–7 не требуют npm-зависимостей.

| Приложение | Команда | Адрес |
| --- | --- | --- |
| API финансов | `npm run server --workspace=task8` | http://localhost:3001 |
| HTML Zen-Money | `npm run serve` | http://localhost:8080/task8/ или /task9/ |
| React Todo | `npm run dev --workspace=task10` | http://localhost:5173/source.html |
| React с сохранением | `npm run dev --workspace=task11` | http://localhost:5174/source.html |
| Next.js Zen-Money | `npm run dev --workspace=task12` | http://localhost:3000 |
| Angular Todo | `npm run dev --workspace=task15` | http://localhost:4200 |

API и фронтенд запускаются в разных терминалах. json-server изменяет `task8/db.json`: перед экспериментами можно сделать копию файла. Работы 8–9 и 12–13 используют один и тот же сервер. В финансовых проектах localStorage хранит только настройки; операции находятся на сервере.

## Публикация

GitHub Pages: `main / (root)`. HTML-работы публикуются напрямую. Для React и Angular в `published/` сохранены готовые production-сборки; обновление из исходников:

```bash
npm run publish:static
```

Next.js имеет серверный динамический маршрут и не запускается на статическом GitHub Pages. Его проект находится в `task12`, продолжение описано в `task13`. Публикация Vercel подготовлена, но ещё требует авторизации владельца; неподтверждённой ссылки на деплой нет.

Для №2 по согласованию используется собственный макет. Телефон в резюме — подписанный учебный пример.

## Проверка и защита

- [Результаты unit- и браузерных проверок](verification/README.md)
- [Чек-лист требований](CHECKLIST.md)
- [План защиты на 5–7 минут](task16/README.md)
- [Карта кода и вопросы](task16/CODE_GUIDE.md)

Каждая лабораторная имеет отдельные коммиты: реализация, оформление/документация, исправления по результатам проверок.
