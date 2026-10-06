"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import TodoImport from "./TodoImport";
import { useState } from "react";
import { toast } from "sonner";
import { useTodos } from "../hooks/useTodos";

type Todo = {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  dueDate: string;
  completed: boolean;
  order: number;
};

interface TodoFormProps {
  addTodo: (
    title: string,
    category: string,
    subCategory: string,
    dueDate: string,
  ) => void;
  importTodos: (todos: Todo[]) => void;
}

const categories = ["Work", "Personal", "Urgent"];
const subWorkCategories = ["Cleaning", "Cooking"];
const subPersonalCategories = ["Exercise", "Learning"];
const subUrgentCategories = ["Call", "Meeting"];

export default function TodoForm({ addTodo, importTodos }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const handleAddTodo = () => {
    if (!title || !dueDate || !category) {
      toast.error("Please fill in the title, category and due date");
      return;
    }
    addTodo(title, category, subCategory, dueDate);
    setTitle("");
    setCategory("");
    setSubCategory("");
    setDueDate("");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          mb: 2,
        }}
      >
        Add a new task
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 1.2fr 1.2fr 1.2fr 1.2fr auto",
          },
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>

          <Select
            value={category}
            label="Category"
            onChange={(event) => setCategory(event.target.value)}
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>

            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Sub-Category</InputLabel>

          <Select
            value={subCategory}
            label="Sub-Category"
            onChange={(event) => setSubCategory(event.target.value)}
          >
            <MenuItem value="" disabled>
              Select sub-category
            </MenuItem>

            {(() => {
              switch (category) {
                case "Work":
                  return subWorkCategories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ));
                case "Personal":
                  return subPersonalCategories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ));
                case "Urgent":
                  return subUrgentCategories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ));
                default:
                  return null;
              }
            })()}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="Due date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleAddTodo}
          sx={{
            height: 40,
            px: 3,
            whiteSpace: "nowrap",
          }}
        >
          Add Task
        </Button>

        <TodoImport onImport={importTodos} />
      </Box>
    </Box>
  );
}
