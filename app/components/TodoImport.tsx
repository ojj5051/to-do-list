"use client";

import { useRef } from "react";
import { Button, Tooltip } from "@mui/material";

import { UploadFile } from "@mui/icons-material";

import * as XLSX from "xlsx";
import { toast } from "sonner";

type Todo = {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

interface TodoImportProps {
  onImport: (todos: Todo[]) => void;
}

export default function TodoImport({ onImport }: TodoImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;

        if (!data) return;

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          {
            defval: "",
          },
        );

        const importedTodos: Todo[] = rows
          .map((row, index) => {
            const title = String(
              row.title ?? row.Title ?? row.task ?? row.Task ?? "",
            ).trim();

            const category = String(row.category ?? row.Category ?? "").trim();

            const dueDate = parseDate(
              row.dueDate ?? row["Due Date"] ?? row["due_date"] ?? "",
            );

            const completed = String(
              row.completed ?? row.Completed ?? row.status ?? row.Status ?? "",
            )
              .trim()
              .toLowerCase();

            const isCompleted =
              completed === "completed" || completed === "true";

            if (!title || !dueDate || !category) {
              return null;
            }

            return {
              id: Date.now() + index,
              title,
              category: category || "Personal",
              dueDate,
              completed: isCompleted,
            };
          })
          .filter((todo): todo is Todo => todo !== null);

        if (importedTodos.length === 0) {
          toast.error("No valid tasks found in the file.");
          return;
        }

        onImport(importedTodos);
      } catch (error) {
        console.error("Failed to import tasks:", error);

        alert("Failed to import tasks. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);

    event.target.value = "";
  };

  const parseDate = (value: unknown): string => {
    if (!value) return "";

    if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value);

      if (!date) return "";

      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
        date.d,
      ).padStart(2, "0")}`;
    }

    const stringValue = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
      return stringValue;
    }

    const parts = stringValue.split("/");

    if (parts.length === 3) {
      const [day, month, year] = parts;

      return `${year}-${String(Number(month)).padStart(2, "0")}-${String(
        Number(day),
      ).padStart(2, "0")}`;
    }

    return "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
      />

      <Tooltip title="Import CSV or Excel">
        <Button
          variant="outlined"
          startIcon={<UploadFile />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          Import
        </Button>
      </Tooltip>
    </>
  );
}
