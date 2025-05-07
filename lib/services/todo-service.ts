"use client";

import { Todo } from '../types/todo-types';

class TodoService {
  private storageKey = 'aura-todos';
  
  getTodos(): Todo[] {
    if (typeof window === 'undefined') return [];
    
    const storedTodos = localStorage.getItem(this.storageKey);
    return storedTodos ? JSON.parse(storedTodos) : [];
  }
  
  saveTodos(todos: Todo[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }
  
  addTodo(todo: Todo): Todo[] {
    const todos = this.getTodos();
    const updatedTodos = [...todos, todo];
    this.saveTodos(updatedTodos);
    return updatedTodos;
  }
  
  deleteTodo(id: string): Todo[] {
    const todos = this.getTodos();
    const updatedTodos = todos.filter(todo => todo.id !== id);
    this.saveTodos(updatedTodos);
    return updatedTodos;
  }
  
  toggleTodo(id: string): Todo[] {
    const todos = this.getTodos();
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos(updatedTodos);
    return updatedTodos;
  }
}

export const todoService = new TodoService();