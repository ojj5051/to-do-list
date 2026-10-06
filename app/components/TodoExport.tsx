"use client";

import { Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import type { Todo } from "../types/todo";

interface TodoExportProps {
  todos: Todo[];
}

export default function TodoExport({ todos }: TodoExportProps) {
  const exportTodos = () => {
    const data = todos.map((todo) => ({
      Task: todo.title,
      Category: todo.category,
      "Sub-Category": todo.subCategory,
      "Due Date": todo.dueDate || "",
      Status: todo.completed ? "Completed" : "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Todo List");

    XLSX.writeFile(workbook, "todo-list.xlsx");
  };

  if(todos.length === 0){
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2,
        my: 2,
        px: 2,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={exportTodos}
      >
        Export Excel
      </Button>
    </Box>
  );
}
