import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Todo = {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

const categories = ["Work", "Personal", "Urgent"];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");

    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error("Failed to parse stored todos:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos, isLoaded]);

  const addTodo = (title: string, category: string, dueDate: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      category,
      dueDate,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    );
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );

    toast.success("Task updated successfully");
  };

  const importTodos = (importedTodos: Todo[]) => {
    setTodos((prev) => [...prev, ...importedTodos]);

    toast.success(`${importedTodos.length} tasks imported successfully`);
  };

  return {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    importTodos,
    categories,
  };
}
