# Zen-Money на Next.js

Из корня: `npm ci`. API: `npm run server --workspace=task8`. В другом терминале: `npm run dev --workspace=task12`, открыть http://localhost:3000. Сборка: `npm run build --workspace=task12`, затем `npm start --workspace=task12`.

Файловые маршруты: `/`, `/add`, `/stats`. Общая навигация использует next/link. FinanceProvider загружает данные json-server на клиенте и делится состоянием через Context. API URL задаётся NEXT_PUBLIC_API_URL в .env.local; по умолчанию http://localhost:3001. Доработки занятия 13 находятся в этом же проекте, описание — ../task13/README.md.
