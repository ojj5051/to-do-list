"use client";

import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";

interface TodoPaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

export default function TodoPagination({
  page,
  totalPages,
  rowsPerPage,
  totalItems,
  setPage,
  setRowsPerPage,
}: TodoPaginationProps) {
  // if (totalItems === 0) {
  //   return null;
  // }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mt: 3,
        mb: 2,
        pt: 2,
        px: 2,
        borderTop: "1px solid",
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Tasks per page
        </Typography>

        <FormControl size="small">
          <Select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages}
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        size="small"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
