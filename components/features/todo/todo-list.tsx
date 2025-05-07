"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Todo, TodoCategory } from '@/lib/types/todo-types';
import { todoService } from '@/lib/services/todo-service';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categories, setCategories] = useState<TodoCategory[]>([
    { id: '1', name: 'Work', color: 'blue' },
    { id: '2', name: 'Personal', color: 'green' },
    { id: '3', name: 'Urgent', color: 'red' }
  ]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    // Load todos from local storage or API
    const loadedTodos = todoService.getTodos();
    setTodos(loadedTodos);
  }, []);

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      createdAt: new Date().toISOString(),
      categoryId: activeCategoryId || undefined
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    todoService.saveTodos(updatedTodos);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    todoService.saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    todoService.saveTodos(updatedTodos);
  };

  const getCategoryById = (id?: string) => {
    if (!id) return null;
    return categories.find(cat => cat.id === id) || null;
  };

  const filteredTodos = todos.filter(todo => {
    let categoryMatch = !activeCategoryId || todo.categoryId === activeCategoryId;
    
    if (filter === 'active') {
      return !todo.completed && categoryMatch;
    } else if (filter === 'completed') {
      return todo.completed && categoryMatch;
    }
    
    return categoryMatch;
  });

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Todo List</CardTitle>
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as any)}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-9 items-center space-x-2 border-y px-4 py-6">
          <div className="flex flex-nowrap overflow-x-auto gap-1 pb-2">
            <Button 
              variant={activeCategoryId === null ? "default" : "outline"} 
              className="whitespace-nowrap h-7 px-2"
              onClick={() => setActiveCategoryId(null)}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategoryId === category.id ? "default" : "outline"}
                className={`whitespace-nowrap h-7 px-2`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add a new task..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button size="icon" onClick={addTodo}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-18rem)] px-4">
          <div className="space-y-2 pb-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => {
                const category = getCategoryById(todo.categoryId);
                return (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between rounded-md border p-3 ${
                      todo.completed ? 'bg-muted/40' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                        {todo.text}
                      </span>
                      {category && (
                        <Badge 
                          variant="outline" 
                          className={`ml-2 bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900 dark:text-${category.color}-300`}
                        >
                          {category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {categories.map(category => (
                            <DropdownMenuItem key={category.id}>
                              Set to {category.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Check className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-2 text-xl font-medium">No tasks found</p>
                <p className="text-sm text-muted-foreground">
                  {filter === 'all'
                    ? "You don't have any tasks yet"
                    : filter === 'active'
                    ? 'All tasks are completed'
                    : 'No completed tasks'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}