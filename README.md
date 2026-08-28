# Todo List App

A simple and responsive Todo List application built with **Next.js**, **TypeScript**, and **Material UI**.

The application allows users to create, edit, complete, delete, filter, sort, import, and reorder tasks. Tasks are persisted locally so they remain available after refreshing or reopening the application.

## Features

* Add new tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as completed
* Task categories
* Due dates
* Search tasks by name
* Filter tasks by:

  * Task name
  * Category
  * Due date range
  * Completion status
* Sort tasks by due date:

  * Earliest
  * Latest
* Manual drag-and-drop task reordering
* Pagination
* Select tasks per page:

  * 5
  * 10
  * 15
  * 20
* Calendar view
* Calendar views:

  * Month
  * Week
  * Day
* Category-based task colors in calendar view
* Show/hide calendar
* CSV/Excel task import
* Toast notifications
* Persistent local storage
* Responsive Material UI interface

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Material UI (MUI)**

## Project Structure

```text
todo-app/
├── public/
│
├── app/
│   │   ├── page.tsx
│   │
│   ├── components/
│   │   ├── TodoForm.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoDnd.tsx
│   │   ├── TodoFilter.tsx
│   │   ├── TodoPagination.tsx
│   │   ├── TodoImport.tsx
│   │   ├── TodoExport.tsx
│   │   ├── TodoDraggableItem.tsx
│   │   └── TodoCalendar.tsx
│   │
│   ├── hooks/
│   │   └── useTodos.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

Node Version

* Node.js 24+
* npm, yarn, pnpm, or bun

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd todo-app
```

Install dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Data Persistence

Tasks are stored using the browser's `localStorage`.

The application saves the Todo list whenever the task state changes:

```text
todos
├── id
├── title
├── category
├── dueDate
├── completed
```

When the application loads, previously saved tasks are retrieved from `localStorage`.

No backend database is required.

## Task Ordering

The application supports two types of ordering:

### Date Sorting

Users can sort tasks by due date:

* Earliest
* Latest

Date sorting only affects the displayed list and does not overwrite the saved manual task order.

### Manual Ordering

Users can drag and drop tasks to change their order.

Each Todo contains an `order` property that represents its manual position.

This order is also persisted in `localStorage`.

## Filtering

Tasks can be filtered using:

* Task name
* Category
* Due date from
* Due date to
* Completion status

Pagination automatically resets when filters are changed.

If the current page becomes unavailable after deleting or filtering tasks, the application automatically moves to the last available page.

## Pagination

Users can select how many tasks are displayed per page:

* 5
* 10
* 15
* 20

Pagination displays:

* Current page
* Total pages
* Previous/next controls
* First/last page controls

The current page is automatically adjusted when the number of available pages changes.

## Calendar

The application provides an optional calendar view using task due dates.

Tasks are displayed according to their due date.

The calendar supports:

* Month view
* Week view
* Day view
* Category-based task colors
* Showing/hiding the calendar

Tasks without a due date are not displayed in the calendar.

## Import

Tasks can be imported in bulk using CSV or Excel files.

The import process converts the imported records into the application's Todo structure.

Expected task information includes:

```text
Task
Category
Due Date
Status
```

Imported tasks are added to the existing Todo list rather than replacing all existing tasks.

## Export

Tasks can be exported in bulk using CSV or Excel files.

The export process converts the application's Todo structure into the CSV or Excel format.

Exported tasks are saved to a file and can be downloaded by the user.

```text
Task
Category
Due Date
Status
```

## Toast Notifications

The application uses toast messages to provide feedback for user actions.

Validation errors are also displayed using toast notifications where appropriate.

## Assumptions

* This is a client-side Todo application.
* No user authentication is required.
* Tasks belong to a single user/browser.
* `localStorage` is sufficient for the expected amount of task data.
* Due dates use the browser's local date/time handling.
* Each task has a unique numeric ID.
* Categories are predefined by the application.
* Imported files are expected to contain valid task information.
* Manual task order is independent from date sorting.

## Error Handling

The application handles common user errors such as:

* Empty task names
* Missing required category
* Invalid imported data
* Invalid dates
* Empty task lists
* Invalid localStorage data

Invalid localStorage data is handled safely rather than causing the application to crash.