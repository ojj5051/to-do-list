"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";

import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import TodoPagination from "./components/TodoPagination";
import TodoCalendar from "./components/TodoCalender";
import TodoForm from "./components/TodoForm";
import TodoDnd from "./components/TodoDnd";
import { useTodos } from "./hooks/useTodos";

export default function Home() {
  const {
    todos,
    setTodos,
    categories,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    importTodos,
  } = useTodos();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filters, setFilters] = useState({
    task: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
    completed: "all",
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "manual">(
    "manual",
  );

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  // Filtering
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (
        filters.task &&
        !todo.title.toLowerCase().includes(filters.task.toLowerCase())
      ) {
        return false;
      }

      if (filters.category !== "all" && todo.category !== filters.category) {
        return false;
      }

      if (
        filters.dateFrom &&
        (!todo.dueDate || todo.dueDate < filters.dateFrom)
      ) {
        return false;
      }

      if (filters.dateTo && (!todo.dueDate || todo.dueDate > filters.dateTo)) {
        return false;
      }

      if (filters.completed !== "all") {
        const completed = filters.completed === "completed";

        if (todo.completed !== completed) {
          return false;
        }
      }

      return true;
    });
  }, [todos, filters]);

  // Sorting
  const sortedTodos = useMemo(() => {
    const result = [...filteredTodos];

    if (sortOrder === "manual") {
      return result;
    }

    return result.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }

      if (!a.dueDate) {
        return 1;
      }

      if (!b.dueDate) {
        return -1;
      }

      const dateA = new Date(a.dueDate).getTime();

      const dateB = new Date(b.dueDate).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredTodos, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / rowsPerPage);

  const paginatedTodos = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return sortedTodos.slice(startIndex, endIndex);
  }, [sortedTodos, page, rowsPerPage]);

  const clearFilters = () => {
    setFilters({
      task: "",
      category: "all",
      dateFrom: "",
      dateTo: "",
      completed: "all",
    });
  };

  useEffect(() => {
    setPage(1);
  }, [filters, rowsPerPage]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.5px",
            mb: 0.5,
          }}
        >
          Todo List
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TodoForm addTodo={addTodo} importTodos={importTodos} />

        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        <TodoFilter
          filters={filters}
          categories={categories}
          sortOrder={sortOrder}
          setFilters={setFilters}
          setSortOrder={setSortOrder}
          clearFilters={clearFilters}
        />

        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        <TodoDnd>
          <TodoItem
            todos={paginatedTodos}
            setTodos={setTodos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
            categories={categories}
            setSortOrder={setSortOrder}
          />
        </TodoDnd>

        <TodoPagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredTodos.length}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          px: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          {remainingTodos} {remainingTodos === 1 ? "task" : "tasks"} remaining
        </Typography>

        {filteredTodos.length !== todos.length && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Showing {filteredTodos.length} of {todos.length}
          </Typography>
        )}
      </Box>

      <TodoCalendar todos={todos} />
    </Container>
  );
}
