import { useRef } from "react";

import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Close, Delete, DragIndicator, Edit, Save } from "@mui/icons-material";

import { useDrag, useDrop } from "react-dnd";

type DragItem = {
  id: number;
  index: number;
};

type Todo = {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

interface TodoDraggableItemProps {
  todo: Todo;
  index: number;
  isEditing: boolean;
  categories: string[];

  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  startEditing: (todo: Todo) => void;
  saveEditing: (todo: Todo) => void;
  cancelEditing: () => void;

  editTitle: string;
  editCategory: string;
  editDueDate: string;

  setEditTitle: (value: string) => void;
  setEditCategory: (value: string) => void;
  setEditDueDate: (value: string) => void;

  moveTodo: (draggedId: number, targetId: number) => void;
  onDragStart: () => void;
}

export default function TodoDraggableItem({
  todo,
  index,
  isEditing,
  categories,
  toggleTodo,
  deleteTodo,
  startEditing,
  saveEditing,
  cancelEditing,
  editTitle,
  editCategory,
  editDueDate,
  setEditTitle,
  setEditCategory,
  setEditDueDate,
  moveTodo,
  onDragStart,
}: TodoDraggableItemProps) {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TODO",

    item: () => {
      onDragStart();
      return {
        id: todo.id,
        index,
      };
    },

    canDrag: !isEditing,

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TODO",

    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();

      const middleY = (rect.bottom - rect.top) / 2;

      const offset = monitor.getClientOffset();

      if (!offset) return;

      const mouseY = offset.y - rect.top;

      if (dragIndex < hoverIndex && mouseY < middleY) {
        return;
      }

      if (dragIndex > hoverIndex && mouseY > middleY) {
        return;
      }

      moveTodo(item.id, todo.id);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <ListItem
      key={todo.id}
      ref={ref}
      disablePadding
      sx={{
        py: 1.5,
        px: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        opacity: isDragging ? 0.4 : 1,
        backgroundColor: isDragging ? "action.hover" : "transparent",
        transition: "background-color 0.2s",
      }}
    >
      {isEditing ? (
        <Box
          sx={{
            py: 1.5,
            px: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "2fr 1fr 1fr auto",
            },
            gap: 1,
            width: "100%",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            label="Task"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            autoFocus
            fullWidth
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>

            <Select
              value={editCategory}
              label="Category"
              onChange={(event) => setEditCategory(event.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Due date"
            value={editDueDate}
            onChange={(event) => setEditDueDate(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
          />

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => saveEditing(todo)}
              aria-label="Save task"
            >
              <Save />
            </IconButton>

            <IconButton onClick={cancelEditing} aria-label="Cancel editing">
              <Close />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <>
          <Checkbox
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "text.disabled" : "text.primary",
              }}
            >
              {todo.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: "action.hover",
                }}
              >
                {todo.category}
              </Typography>

              {todo.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  Due {todo.dueDate}
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => startEditing(todo)}
              aria-label={`Edit ${todo.title}`}
            >
              <Edit />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.title}`}
            >
              <Delete />
            </IconButton>
          </Box>
        </>
      )}
    </ListItem>
  );
}
