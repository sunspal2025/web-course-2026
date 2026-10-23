import { Injectable } from '@angular/core';
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}
@Injectable({ providedIn: 'root' })
export class TodoService {
  tasks: Task[] = [];
  private nextId = 1;
  add(text: string): boolean {
    const value = text.trim();
    if (!value) return false;
    this.tasks = [...this.tasks, { id: this.nextId++, text: value, completed: false }];
    return true;
  }
  toggle(id: number): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
  }
  remove(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
