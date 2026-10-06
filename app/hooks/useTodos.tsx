import { useCallback, useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { categories, type Todo } from "../types/todo";

export type { Todo };

const STORAGE_KEY = "todos";

const listeners = new Set<() => void>();
let cachedSnapshot = "[]";

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readStorage(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch (error) {
    console.error("Failed to read stored todos:", error);
    return cachedSnapshot;
  }
}

function getSnapshot(): string {
  const next = readStorage();

  if (next !== cachedSnapshot) {
    cachedSnapshot = next;
  }

  return cachedSnapshot;
}

function getServerSnapshot(): string {
  return "[]";
}

function normalizeTodo(value: unknown, index: number): Todo {
  const todo =
    value && typeof value === "object"
      ? (value as Partial<Todo>)
      : ({} as Partial<Todo>);

  return {
    id: typeof todo.id === "number" ? todo.id : Date.now() + index,
    title: typeof todo.title === "string" ? todo.title : "",
    category: typeof todo.category === "string" ? todo.category : "",
    subCategory: typeof todo.subCategory === "string" ? todo.subCategory : "",
    dueDate: typeof todo.dueDate === "string" ? todo.dueDate : "",
    completed: Boolean(todo.completed),
    ...(typeof todo.order === "number" ? { order: todo.order } : {}),
  };
}

function parseTodos(raw: string): Todo[] {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item, index) => normalizeTodo(item, index));
  } catch (error) {
    console.error("Failed to parse stored todos:", error);
    return [];
  }
}

function writeTodos(next: Todo[]) {
  const serialized = JSON.stringify(next);
  cachedSnapshot = serialized;

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save todos:", error);
  }

  emitChange();
}

export function useTodos() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const todos = useMemo(() => parseTodos(raw), [raw]);

  const setTodos = useCallback((action: Todo[] | ((prev: Todo[]) => Todo[])) => {
    const prev = parseTodos(getSnapshot());
    const next = typeof action === "function" ? action(prev) : action;
    writeTodos(next);
  }, []);

  const addTodo = (
    title: string,
    category: string,
    subCategory: string,
    dueDate: string,
  ) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      category,
      subCategory,
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
