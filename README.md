# AlgoLens - Interview Prep Learning Platform

AlgoLens is a structured DSA learning platform for students and job-seekers preparing for technical interviews. It combines algorithm visualization, guided execution, authentication, and progress tracking into one workflow so learners can understand concepts and measure consistency.

Live deployment: [https://algolens-one.vercel.app/](https://algolens-one.vercel.app/)

---

## Problem Statement

Interview preparation is often fragmented:

* Visual learning happens on one platform
* Coding practice happens on another
* Progress tracking is usually manual and inconsistent

This fragmentation leads to weak retention, poor consistency, and unclear readiness before interviews.

---

## Solution

AlgoLens solves this by combining:

* Algorithm visualization
* Step-by-step guided execution
* Firebase authentication
* Firestore-backed progress tracking

into a single unified platform.

The goal is to move from **random practice** to **intentional learning with measurable progress**.

---

## Why This Project Matters

AlgoLens focuses on understanding rather than memorization.

By combining visual learning with step control and persistent progress tracking, it helps learners:

* Build strong algorithmic intuition
* Stay consistent during preparation
* Track actual learning progress over time

This directly improves confidence and interview readiness.

---

## Features

### 1. Sorting Visualizer (Step-Based)

* Interactive Bubble Sort simulation
* Play, pause, next-step, and reset controls
* Custom array size and value range controls
* Precomputed step execution for full control
* Per-step explanations with visual highlights for comparing and sorted values

---

### 2. Graph Visualizer (BFS Walkthrough)

* Step-by-step Breadth-First Search traversal
* Selectable BFS start node
* Visual graph with node states:

  * Active node
  * Visited nodes
  * Unvisited nodes

* Queue state visualization for understanding BFS order
* Traversal order display
* Explanation panel describing each step

---

### 3. Progress Tracker (CRUD System)

* Create learning tasks
* Read saved user-specific tasks
* Update title, topic, and status
* Delete tasks
* Status workflow:

  * To Do
  * In Progress
  * Completed

* Persistent Firestore storage for authenticated users

---

### 4. Authentication System

* Signup, login, and logout
* Firebase Email/Password Authentication
* Protected routes for all learning modules
* Username-based dashboard personalization

---

### 5. Theme System

* Light and dark mode support
* Theme preference stored locally
* Consistent responsive UI across desktop and mobile

---

## Tech Stack

* **Frontend:** React + Vite
* **Routing:** React Router DOM
* **Backend:** Firebase Authentication
* **Database:** Cloud Firestore
* **State Management:** React Context API
* **Styling:** CSS with responsive layouts and theme variables
* **Deployment:** Vercel

---

## Backend Setup

AlgoLens is configured to use **Firebase Authentication + Cloud Firestore** as the real backend.

The deployed version uses Firebase environment variables configured in Vercel, so user signup, login, and progress CRUD data are handled by Firebase instead of the local fallback.

### Firebase Services Used

* **Firebase Authentication:** Email/password signup, login, logout
* **Cloud Firestore:** User profiles and progress task storage

### Firestore Data Shape

```text
users/{uid}
users/{uid}/progressItems/{itemId}
```

Each authenticated user gets their own profile document and progress items subcollection.

### Required Environment Variables

Create a local `.env` file using `.env.example` as a template:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

The real `.env` file is intentionally ignored by Git because it contains project-specific Firebase configuration.

### Local Fallback Mode

If Firebase environment variables are missing, AlgoLens can still run in demo mode using `localStorage`. This is useful for local testing, but the production Vercel deployment is configured to use Firebase.

---

## Architecture

The project follows a modular and scalable structure:

* `src/pages` - Route-level pages such as Dashboard, Sorting, Graph, Progress, Auth, and Landing
* `src/components` - Reusable UI components and visualizers
* `src/context` - Global state for Auth and Theme
* `src/hooks` - Custom hooks for clean context usage
* `src/services` - Firebase integration and data handling for auth, profile, and progress
* `src/routes` - Protected route logic

---

## React Concepts Demonstrated

* Functional components
* Props and component composition
* `useState` for local state
* `useEffect` for side effects and data loading
* Conditional rendering for auth, loading, empty, and error states
* Lists and keys for task and visualizer rendering
* Controlled components for forms and visualizer controls
* React Router for navigation
* Context API for auth and theme state
* `useMemo` and `useCallback` for optimization
* `React.lazy` and `Suspense` for lazy-loaded pages

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Copy the example environment file:

```bash
cp .env.example .env
```

Then add your Firebase web app credentials to `.env`.

### 3. Run Locally

```bash
npm run dev
```

### 4. Validate Before Submission

```bash
npm run lint
npm run build
```

---

## Deployment

The app is deployed on Vercel:

[https://algolens-one.vercel.app/](https://algolens-one.vercel.app/)

The same Firebase environment variables must be added in Vercel under:

```text
Project Settings -> Environment Variables
```

After changing Vercel environment variables, redeploy the project so the new values are included in the production build.

---

## Demo Flow

1. Sign up or log in with Firebase Authentication
2. Navigate to the personalized dashboard
3. Open Sorting Visualizer and run Bubble Sort step by step
4. Open Graph Visualizer and explore BFS traversal
5. Add tasks in Progress Tracker
6. Update task status and edit task details
7. Refresh the page to show Firestore persistence
8. Delete a task to demonstrate full CRUD functionality

This demonstrates the complete workflow from **learning -> understanding -> tracking progress**.

---

## Future Scope

* Add more graph algorithms such as DFS, Dijkstra, and Topological Sort
* Add more sorting algorithms such as Selection Sort, Merge Sort, and Quick Sort
* Add a code visualizer with line-by-line execution
* Introduce analytics such as streaks and weak-topic detection
* Enable shared learning plans and collaborative preparation
* Add automated testing and CI/CD pipelines

---

## Final Note

AlgoLens is designed as a **learning-focused product**, not just a visualizer.
It emphasizes clarity, control, and consistency, which are key factors for mastering algorithms and succeeding in technical interviews.
