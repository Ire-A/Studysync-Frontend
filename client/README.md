# StudySync – Client‑Side Application

**Group Name:** StudySync  
**Application Name:** StudySync Client  

---

## Authors & Contributions

All team members contributed equally to the design, implementation, and documentation of the client‑side components.

| Name                         | Contribution                                                                 |
|------------------------------|------------------------------------------------------------------------------|
| Ireoluwatomiwa Awonola       | Pages (Home, Dashboard, Groups, GroupDetail), responsive layout, theming     |
| Olimeh Kelvin                | Pages (Login, Register, Tasks, Resources), client‑side validation, API integration |
| Francis Ngonadi              | Pages (CreateGroup, CreateSession, JoinGroup, About, Contact), navigation components (Navbar, Footer) |

> **Division of Labour:** Work was evenly divided (≈33% each) across all three members. Every file lists all three authors to reflect collaborative ownership.

---

## Project Overview

StudySync is a student collaboration platform that helps users organise study groups, schedule sessions, manage coursework tasks, and share resources (links and notes). This repository contains the **complete client‑side user interface** built with **VITE** and **Material UI (MUI)**.

The application communicates with a separate **Node.js/Express backend** (deployed on Render) via a REST API. All features are fully functional – users can register, log in, create groups, add tasks and sessions, share resources, and join existing groups by entering a Group ID.

---

## Features / Views (>3 pages)

The application includes the following pages, each with a clear purpose:

| Page              | Route               | Description                                                                 |
|-------------------|---------------------|-----------------------------------------------------------------------------|
| Home              | `/`                 | Marketing landing page with feature highlights and call‑to‑action buttons.  |
| Login             | `/login`            | Authenticates an existing user, stores user data in `localStorage`.         |
| Register          | `/register`         | Creates a new user account with client‑side validation.                     |
| Dashboard         | `/dashboard`        | Personalised overview: groups, upcoming sessions, pending tasks.            |
| Groups            | `/groups`           | Lists all groups the user belongs to; buttons to create or join a group.    |
| GroupDetail       | `/group/:id`        | Detailed view of a single group (sessions, tasks, resources in tabs).       |
| CreateGroup       | `/create-group`     | Form to create a new study group.                                           |
| JoinGroup         | `/join-group`       | Enter a Group ID to join an existing group.                                 |
| CreateSession     | `/create-session`   | Schedule a new study session for a selected group.                          |
| Tasks             | `/tasks`            | Manage tasks: add, mark as completed, view deadlines.                       |
| Resources         | `/resources`        | Share links or notes within a group.                                        |
| About             | `/about`            | Information about the platform and its origin.                              |
| Contact           | `/contact`          | Demo contact form (no actual email sending).                                |

All protected routes (e.g., Dashboard, Groups, Tasks) redirect unauthenticated users to `/login`.

---

## Technologies Used

- **React** – component‑based UI library
- **React Router** – client‑side routing
- **Material UI (MUI)** – component library with custom theming and responsive design
- **MUI Icons** – scalable vector icons
- **Fetch API** – HTTP requests to the backend (with credentials for session cookies)
- **LocalStorage** – persists user data across page reloads, triggers navbar updates via custom events

---

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher)
- The StudySync backend running locally or on Render

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd studysync-client
2. Install dependencies
    ```bash
    npm install
3. Create a .env file in the root directory
    ```bash
    VITE_API_URL=http://localhost:5000   # or your deployed backend URL
    