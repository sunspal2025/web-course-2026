# Todo на Angular

Из корня: `npm ci`, `npm run dev --workspace=task15`, открыть http://localhost:4200. Production: `npm run build --workspace=task15`. Используется Angular 20: в нём доступны требуемые заданием *ngFor и *ngIf.

В React список принадлежит App, а дочерние компоненты меняют его через callbacks в props. Здесь массив и методы вынесены в TodoService, который Angular внедряет в конструктор компонента. [(ngModel)] связывает поле и text в обе стороны; в React аналогичный ввод требует value и onChange. Пустое состояние показано через *ngIf, задачи — через *ngFor с trackBy по id.

Для GitHub Pages сохранена production-сборка в published/. index.html перенаправляет на неё; обновление сборки — npm run publish:static из корня.
