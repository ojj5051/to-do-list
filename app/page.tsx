"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Select,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

import TodoItem from "./components/TodoItem";
import { toast } from "sonner";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  dueDate: string;
};

const categories = ["Work", "Personal", "Urgent"];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const addTodo = () => {
    if (!title || !dueDate || !category) {
      toast.error("Please fill in the title, category and due date");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      category,
      dueDate,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setTitle("");
    setDueDate("");
  };

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id !== id) {
          return todo;
        }

        return {
          ...todo,
          completed: !todo.completed,
        };
      }),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [todos, sortOrder]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Todo List
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
          }}
        >
          Keep track of your tasks
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="New task"
            placeholder="Enter a task..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            displayEmpty
            fullWidth
            size="small"
          >
            <MenuItem value="">Select category</MenuItem>

            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>

          <TextField
            type="date"
            fullWidth
            size="small"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />

          <Button
            variant="contained"
            onClick={addTodo}
            sx={{
              px: 3,
              flexShrink: 0,
            }}
          >
            Add
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={
              sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />
            }
            onClick={() =>
              setSortOrder((current) => (current === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "Earliest" : "Latest"}
          </Button>
        </Box>

        <TodoItem
          todos={sortedTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </Paper>

      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "text.secondary",
        }}
      >
        {remainingTodos} {remainingTodos === 1 ? "task" : "tasks"} remaining
      </Typography>
    </Container>
  );
}
