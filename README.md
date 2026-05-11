# StudySync – Client‑Side Application

**Group Name:** StudySync  
**Application Name:** StudySync Client  
**Assignment:** WT – Assignment 3 – Client‑side components  
**Submission Date:** 27/04/2026  

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

StudySync is a student collaboration platform that helps users organise study groups, schedule sessions, manage coursework tasks, and share resources (links and notes). This repository contains the **complete client‑side user interface** built with **React** and **Material UI (MUI)**.

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
- **Vite** – fast build tool and development server
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

4. Start the development server
   ```bash
   npm run dev
5. Open http://localhost:5173 in your browser.

 Client‑Side Validation
All forms include meaningful validation before sending data to the backend. Error messages are displayed using MUI Alert components.

Page	Validation Rules
Register	Name, email, password required. Email must contain @. Password ≥ 6 characters.
Login	Email and password required. Email must contain @.
CreateGroup	Group name required. Description must be at least 10 characters.
CreateSession	Title, group, date required. Date cannot be in the past.
JoinGroup	Group ID cannot be empty.
Tasks	Title required. Deadline cannot be in the past.
Resources	Title and content required. If type is link, content must be a valid URL.
Contact (demo)	Message cannot be empty (no backend call).
📱 Responsive Design
The application adapts to different screen sizes using MUI’s responsive breakpoints (xs, sm, md, lg). Key responsive behaviours:

Navbar – desktop shows horizontal links; mobile shows a hamburger drawer.

Grid layouts – pages like Dashboard, Groups, Tasks use Grid with xs={12} (full width on mobile), md={4} or md={6} on larger screens.

Typography – font sizes scale down on mobile (e.g., fontSize: { xs: "2rem", md: "2.8rem" }).

Padding & margins – adjusted per breakpoint for comfortable touch targets.

All pages have been tested on desktop, tablet, and mobile views.

🌐 Deployment
The client application is deployed on Render as a static site.

Live URL: https://studysync-frontend-0vrv.onrender.com (replace with your actual URL)

Build command: npm run build

Publish directory: dist

Environment variable: VITE_API_URL = https://studysync-iqaq.onrender.com (your backend URL)

📄 Required Assignment Outputs
This repository includes:

All project files (React components, services, assets)

README.md (this file)

Coversheet PDF (submitted separately as part of the zip)

📚 References & Third‑Party Resources
React Documentation

Vite Documentation

Material UI (MUI) Documentation

React Router Documentation

Render Static Site Deployment Guide

AI Use Declaration:
No generative AI was used to write code blocks. AI (IDE autocomplete) was used only for support tasks (e.g., generating repetitive component structures, fixing typos). All core logic and styling were written by the team, in compliance with the AI Assessment Scale level “AI for Support Tasks”.

🧪 Testing
You can test the application by:

Registering a new user.

Logging in.

Creating a study group.

Adding a session, task, or resource.

Joining another group by entering its ID (copy the ID from an existing group’s detail page).

All validations, redirects, and API calls should work as expected.


    
