import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  List,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface TodoItemProps {
  todos: any[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoItem({
  todos,
  toggleTodo,
  deleteTodo,
}: TodoItemProps) {
  return (
    <>
      {todos.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            No tasks yet
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: "text.disabled",
            }}
          >
            Add a task to get started
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              disablePadding
              sx={{
                py: 1.5,
                px: 1,
                borderBottom: "1px solid",
                borderColor: "divider",

                "&:hover": {
                  backgroundColor: "action.hover",
                },

                transition: "background-color 0.2s ease",
              }}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                sx={{
                  mr: 1,
                }}
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
                  }}
                >
                  <Chip
                    label={todo.category}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      opacity: todo.completed ? 0.5 : 1,
                    }}
                  />

                  {todo.dueDate && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: todo.completed
                          ? "text.disabled"
                          : "text.secondary",
                      }}
                    >
                      Due {todo.dueDate}
                    </Typography>
                  )}
                </Box>
              </Box>

              <IconButton
                edge="end"
                aria-label={`Delete ${todo.title}`}
                color="error"
                onClick={() => deleteTodo(todo.id)}
                sx={{
                  ml: 1,
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
