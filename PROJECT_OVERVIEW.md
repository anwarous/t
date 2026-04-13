# Learning++ Project Overview

## What This Project Is
Learning++ (Learning++) is an interactive learning platform focused on algorithms and coding practice. It combines a modern React frontend with a Spring Boot backend API to deliver courses, exercises, progress tracking, and gamification features such as XP, badges, and streaks.

## High-Level Architecture
- Frontend: React + TypeScript single-page application (Vite)
- Backend: Spring Boot REST API (Java 21)
- Data layer: Spring Data JPA (H2 in development, production DB configurable)
- Infrastructure: Docker and Docker Compose for local and production-style deployment

## Core Product Features
- Course browsing and lesson progression
- Coding exercises with submission flow
- Algorithm visualization pages
- Code editor experience (Monaco-based)
- AI mentor-style chat interface (mocked/fronted behavior ready for real API integration)
- User profile and progress tracking
- Leaderboard and gamification (XP, levels, badges, streaks)
- Internationalization support (English and French locales)

## Frontend Overview
Main frontend technologies:
- React 18 + TypeScript
- Vite for dev/build
- Tailwind CSS for styling
- Zustand for client state management
- Framer Motion for animations
- React Router for navigation
- i18next for localization

Important directories:
- `src/pages`: application screens (Dashboard, Learn, CodeEditor, Mentor, Visualization, etc.)
- `src/components`: reusable UI and layout components
- `src/store`: global state stores
- `src/lib`: API and utility helpers
- `src/locales`: translation resources

## Backend Overview
Main backend technologies:
- Spring Boot 3.2.x
- Spring Security + JWT authentication
- Spring Data JPA + Hibernate
- Jakarta Bean Validation
- Maven build tooling

API domains include:
- Authentication (`/api/auth`)
- User profile and activity (`/api/users`)
- Courses (`/api/courses`)
- Exercises and submissions (`/api/exercises`)
- Progress (`/api/progress`)
- Leaderboard (`/api/leaderboard`)

## Development Workflow
Frontend (from project root):
```bash
npm install
npm run dev
```

Backend (from `backend`):
```bash
mvn spring-boot:run
```

Default local ports (as currently documented):
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080` (standalone backend run)

## Docker Deployment
The repository includes:
- `Dockerfile` and `Dockerfile.frontend`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- Nginx config under `docker/nginx`

This supports:
- Production-style containerized runs
- Development override mode with hot-reload frontend

## Current Status and Direction
The codebase is structured for production readiness and clean feature separation. Several capabilities are already integrated end-to-end (routing, UI flows, API structure, security model), while some advanced pieces (for example real AI integration and fully externalized code execution sandboxing) are designed to be connected as next-phase enhancements.

## Who This Is For
- Learners practicing algorithms in an interactive environment
- Mentors/instructors tracking progress and engagement
- Developers extending a full-stack educational platform with modern tooling

## Useful Existing Documentation
- `README.md`: frontend and platform setup
- `backend/README.md`: backend API details and environment notes
- `PROD_DEPLOYMENT_MANUAL.md`: production deployment guidance
- `FRONTEND_DOCUMENTATION.md`: frontend-focused documentation
- `PERFORMANCE_FIX_REPORT.md`: performance-related implementation notes
