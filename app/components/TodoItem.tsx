"use client";

import { useState } from "react";
import { List, Typography } from "@mui/material";
import TodoDraggableItem from "./TodoDraggableItem";
import type { Todo } from "../types/todo";

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
  const [editSubCategory, setEditSubCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditCategory(todo.category);
    setEditSubCategory(todo.subCategory);
    setEditDueDate(todo.dueDate);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCategory("");
    setEditSubCategory("");
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
      subCategory: editSubCategory,
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
      {todos.length === 0 ? (
        <Typography sx={{ textAlign: "center", my: 2 }}>
          No tasks yet
        </Typography>
      ) : (
        todos.map((todo, index) => {
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
              editSubCategory={editSubCategory}
              editDueDate={editDueDate}
              setEditTitle={setEditTitle}
              setEditCategory={setEditCategory}
              setEditSubCategory={setEditSubCategory}
              setEditDueDate={setEditDueDate}
              moveTodo={reorderTodos}
              onDragStart={() => {}}
            />
          );
        })
      )}
    </List>
  );
}
