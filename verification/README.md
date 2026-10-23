# Проверка работ

## Unit-тесты

Из корня `npm ci && npm test`. Фактический запуск: 15 тестов Jest и 14 тестов Vitest/React Testing Library, все проходят. [Вывод терминала](../task14/tests-output.txt), [изображение вывода](../task14/tests-result.png).

## Браузер

Проверено в Chromium 156 через Playwright. Сценарии доступны в browser_static.py и browser_frameworks.py. Они запускаются с корнем репозитория на http://127.0.0.1:8080, json-server на :3001, production Next.js на :3000. Для повторения нужны Python 3 и установленный Chromium Playwright:

```bash
python3 -m venv /tmp/course-browser-env
/tmp/course-browser-env/bin/pip install -r verification/requirements.txt
/tmp/course-browser-env/bin/playwright install chromium
# В отдельных терминалах: npm run serve; npm run server --workspace=task8;
# npm run build --workspace=task12 && npm start --workspace=task12
# Готовые React/Angular-сборки: npm run publish:static
/tmp/course-browser-env/bin/python verification/browser_static.py
/tmp/course-browser-env/bin/python verification/browser_frameworks.py
```

Финансовый сценарий рассчитан на исходные две учебные записи в db.json и создаёт/удаляет временные QA-записи. Перед запуском сохранить копию db.json. Не запускать против личных финансовых данных.

Проверены семантика и аватар, семь ширин лендинга, CRUD Todo, фильтры, перезапуски, блокировка ввода Simon, рост/столкновения змейки, пагинация до 100 постов, локальный поиск, реальный HTTP CRUD финансов, persistence React и настройки темы, маршруты Next.js и ошибки API. Отдельно проверено одинаковое перемещение змейки при симуляции 60/144 кадров в секунду.

Сетевые ветки ленты проверяются детерминированными ответами Playwright; доступность реального JSONPlaceholder проверяется отдельно. Успешные браузерные сценарии не вызывают ошибок JavaScript (pageerror). Это не проверка всех возможных действий и не тест на физических устройствах.

## Сборки

`npm run build` собирает оба React-приложения, Next.js и Angular. `npm run publish:static` обновляет сборки React/Angular в published/ для GitHub Pages. Локальный json-server не публикуется на Pages; Первый Vercel-деплой Next.js подтверждён владельцем и статусом GitHub.

## Проверка после редизайна

redesign_browser.py проверяет девять страниц на ширинах 320/375/768/1024/1440, данные профиля и загрузку портрета, светлую/тёмную палитры, контраст основной кнопки и reduced motion. Результаты — в redesign-results.txt.
