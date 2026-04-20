# AlgoLens - Interview Prep Learning Platform

AlgoLens is a structured DSA learning platform designed for students and job-seekers preparing for technical interviews.

## 1) Problem Statement

Interview preparation is often fragmented:

- Visual learning happens on one platform
- Coding practice happens on another
- Progress tracking is usually manual and inconsistent

This creates weak retention, poor consistency, and unclear readiness before interviews.

## 2) Solution

AlgoLens combines algorithm visualization, guided step-by-step understanding, and progress tracking into a single product workflow.

The goal is to move from random practice to intentional learning with measurable progress.

## 3) Features

- **Sorting Visualizer (Step-Based)**
  - Interactive Bubble Sort simulation
  - Play, pause, next-step, reset
  - Per-step explanation and visual state highlights

- **Graph Visualizer (BFS Walkthrough)**
  - Step-by-step BFS traversal
  - Visual node graph with active and visited highlights
  - Queue state visibility and explanation panel

- **Progress Tracker (Real CRUD)**
  - Create learning tasks
  - Update task title/topic/status
  - Delete tasks
  - Status workflow: To Do -> In Progress -> Completed

- **Authentication System**
  - Signup/login/logout
  - Protected routes for learning modules
  - Username-aware dashboard greeting

## 4) Tech Stack

- **Frontend:** React + Vite
- **Routing:** React Router
- **Backend/Auth/DB:** Firebase Authentication + Firestore
- **State Management:** React Context API (Auth + Theme)
- **Persistence Fallback:** localStorage fallback when Firebase env vars are not configured

## 5) Architecture

- `src/pages` - route-level pages and feature modules
- `src/components` - reusable UI sections and visualizers
- `src/context` - global contexts (`AuthContext`, `ThemeContext`)
- `src/hooks` - context access hooks
- `src/services` - Firebase + profile/progress data services
- `src/routes` - protected route guard

## 6) Setup Instructions

### Install and run

```bash
npm install
npm run dev
```

### Firebase environment setup

1. Copy `.env.example` to `.env`
2. Fill:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

If these values are missing, AlgoLens still runs in demo mode using local persistence.

### Validate build quality

```bash
npm run lint
npm run build
```

## 7) Future Scope

- Add more graph algorithms (DFS, Dijkstra, Topological Sort)
- Add code visualizer with line-by-line execution
- Add analytics dashboard with streaks and weak-topic insights
- Add shared/public learning plans and collaborative prep rooms
- Add test coverage and CI checks for deployment pipelines
