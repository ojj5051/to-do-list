"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";

import { format, parse, startOfWeek, getDay } from "date-fns";

import enUS from "date-fns/locale/en-US";

import { Box, Chip, IconButton, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import "react-big-calendar/lib/css/react-big-calendar.css";

type Todo = {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

interface TodoCalendarProps {
  todos: Todo[];
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const categoryColors: Record<string, string> = {
  Work: "#1976d2",
  Personal: "#2e7d32",
  Urgent: "#d32f2f",
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] ?? "#607d8b";
};

export default function TodoCalendar({ todos }: TodoCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const events = useMemo(() => {
    return todos
      .filter((todo) => todo.dueDate)
      .map((todo) => {
        const date = new Date(`${todo.dueDate}T00:00:00`);

        return {
          id: todo.id,
          title: todo.title,
          start: date,
          end: date,
          allDay: true,
          category: todo.category,
          completed: todo.completed,
        };
      });
  }, [todos]);

  return (
    <Box
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          Calendar
        </Typography>

        <IconButton
          onClick={() => setShowCalendar((prev) => !prev)}
          aria-label={showCalendar ? "Hide calendar" : "Show calendar"}
        >
          {showCalendar ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {showCalendar && (
        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            {Object.entries(categoryColors).map(([category, color]) => (
              <Chip
                key={category}
                label={category}
                size="small"
                sx={{
                  backgroundColor: color,
                  color: "#fff",
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              height: 650,
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: getCategoryColor(event.category),
                  opacity: event.completed ? 0.5 : 1,
                  textDecoration: event.completed ? "line-through" : "none",
                },
              })}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
