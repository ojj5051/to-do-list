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

import { ArrowDownward, ArrowUpward, DragIndicator } from "@mui/icons-material";

export interface TodoFilters {
  task: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  completed: string;
}

interface TodoFilterProps {
  filters: TodoFilters;
  categories: string[];
  sortOrder: "asc" | "desc" | "manual";

  setFilters: React.Dispatch<React.SetStateAction<TodoFilters>>;

  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc" | "manual">>;

  clearFilters: () => void;
}

export default function TodoFilter({
  filters,
  categories,
  sortOrder,
  setFilters,
  setSortOrder,
  clearFilters,
}: TodoFilterProps) {
  const hasFilters =
    filters.task ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.completed !== "all";

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "action.hover",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Filter & Sort
        </Typography>

        {hasFilters && (
          <Button
            size="small"
            color="inherit"
            onClick={clearFilters}
            sx={{
              textTransform: "none",
            }}
          >
            Clear filters
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            sm: "2fr 1.5fr 1.5fr 1.5fr 1.5fr auto",
          },
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Search task"
          placeholder="Search by task name..."
          value={filters.task}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              task: event.target.value,
            }))
          }
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>

          <Select
            value={filters.category}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
          >
            <MenuItem value="all">All Categories</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Status</InputLabel>

          <Select
            value={filters.completed}
            label="Status"
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                completed: event.target.value,
              }))
            }
          >
            <MenuItem value="all">All Status</MenuItem>

            <MenuItem value="pending">Pending</MenuItem>

            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="From"
          value={filters.dateFrom}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateFrom: event.target.value,
            }))
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
        />

        <TextField
          size="small"
          type="date"
          label="To"
          value={filters.dateTo}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateTo: event.target.value,
            }))
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
        />

        <Button
          size="small"
          variant="outlined"
          startIcon={
            sortOrder === "asc" ? (
              <ArrowUpward />
            ) : sortOrder === "desc" ? (
              <ArrowDownward />
            ) : (
              <DragIndicator />
            )
          }
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc" )}
          sx={{
            height: 40,
            minWidth: 120,
            whiteSpace: "nowrap",
          }}
        >
          {sortOrder === "asc"
            ? "Earliest"
            : sortOrder === "desc"
              ? "Latest"
              : "Manual"}
        </Button>
      </Box>
    </Box>
  );
}
