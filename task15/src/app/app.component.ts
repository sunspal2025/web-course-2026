import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TodoService,Task} from './todo.service';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html'})
export class AppComponent {
 text = ''; error = ''; filter = 'all';
 constructor(public todos: TodoService) {}
 get visible(): Task[] { return this.todos.tasks.filter(task => this.filter === 'all' || (this.filter === 'completed' ? task.completed : !task.completed)); }
 get completed(): number { return this.todos.tasks.filter(task => task.completed).length; }
 add(): void { if (this.todos.add(this.text)) { this.text = ''; this.error = ''; } else this.error = 'Введите текст задачи.'; }
 trackById(index: number,task: Task): number { return task.id; }
}
