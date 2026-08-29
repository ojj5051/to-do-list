"use client";

import { useState } from "react";
import { List } from "@mui/material";
import TodoDraggableItem from "./TodoDraggableItem";

type Todo = {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

interface TodoItemProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  toggleTodo: (id: number) => void;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  categories: string[];
  setSortOrder: (order: "asc" | "desc" | "manual") => void;
}

export default function TodoItem({
  todos,
  setTodos,
  deleteTodo,
  toggleTodo,
  updateTodo,
  categories,
  setSortOrder,
}: TodoItemProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCategory("");
    setEditDueDate("");
  };

  const saveEditing = (todo: Todo) => {
    if (!editTitle.trim()) {
      return;
    }

    updateTodo({
      ...todo,
      title: editTitle.trim(),
      category: editCategory,
      dueDate: editDueDate,
    });

    setEditingId(null);
  };

  const reorderTodos = (draggedId: number, targetId: number) => {
    setTodos((prev) => {
      const fromIndex = prev.findIndex((todo) => todo.id === draggedId);

      const toIndex = prev.findIndex((todo) => todo.id === targetId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return prev;
      }

      const updated = [...prev];

      const [moved] = updated.splice(fromIndex, 1);

      updated.splice(toIndex, 0, moved);

      return updated.map((todo, index) => ({
        ...todo,
        order: index,
      }));
    });

    setSortOrder("manual");
  };

  return (
    <List disablePadding>
      {todos.map((todo, index) => {
        const isEditing = editingId === todo.id;

        return (
          <TodoDraggableItem
            key={todo.id}
            todo={todo}
            index={index}
            isEditing={isEditing}
            categories={categories}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            startEditing={startEditing}
            saveEditing={saveEditing}
            cancelEditing={cancelEditing}
            editTitle={editTitle}
            editCategory={editCategory}
            editDueDate={editDueDate}
            setEditTitle={setEditTitle}
            setEditCategory={setEditCategory}
            setEditDueDate={setEditDueDate}
            moveTodo={reorderTodos}
            onDragStart={() => {}}
          />
        );
      })}
    </List>
  );
}
