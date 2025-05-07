export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  categoryId?: string;
  dueDate?: string;
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
}