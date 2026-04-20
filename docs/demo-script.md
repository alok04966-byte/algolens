# AlgoLens Demo Script (3-5 minutes)

## 1) Product Narrative (30-45 sec)

- AlgoLens is built for students/job-seekers preparing for coding interviews.
- Core pain: prep is fragmented and progress is hard to track.
- Value: one platform for concept visualization + guided practice + measurable progress.

## 2) App Architecture (45-60 sec)

- Show route structure: public landing/auth + protected dashboard modules.
- Explain `AuthContext` for global auth state and protected navigation.
- Mention service abstraction (`progressService`) and Firebase integration.

## 3) Authentication + Protected Routes (45-60 sec)

- Sign up / login with email-password flow.
- Navigate to protected page without auth to show route guard behavior.
- Mention fallback mode for local testing if Firebase env is absent.

## 4) Three Core Features (90-120 sec)

1. Sorting Visualizer  
   Generate array, run sorting, pause, next-step, and explain state transitions.
2. Graph Visualizer  
   Select start node, generate BFS traversal, step through visited order.
3. Progress Tracker CRUD  
   Add a learning task, mark in progress, mark done, and delete task.

## 5) Persistence + Deployment Readiness (30-45 sec)

- Show progress items persisting across refresh.
- Point to `.env.example` and README deployment instructions.
- Mention tested scripts: `npm run lint`, `npm run build`.

## 6) Close (15-30 sec)

- Reiterate rubric coverage: React architecture, routing, auth, backend CRUD, feature breadth, and submission quality.
