# MQAcademy API

A production-quality Spring Boot 3 REST API backend for the **MQAcademy** algorithm learning platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.2.x |
| Language | Java 21 |
| Security | Spring Security 6 + JWT (jjwt 0.12.3) |
| Persistence | Spring Data JPA + Hibernate |
| Database (dev) | H2 in-memory |
| Validation | Jakarta Bean Validation |
| Build | Maven |

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+

### Run in development
```bash
cd backend
mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

H2 Console (dev): http://localhost:8080/h2-console  
JDBC URL: `jdbc:h2:mem:mqacademy`  
Username: `sa` | Password: *(empty)*

## API Endpoints

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | ✅ | Get own profile |
| PUT | `/api/users/me` | ✅ | Update display name / avatar |
| GET | `/api/users/me/badges` | ✅ | List earned badges |
| GET | `/api/users/me/submissions` | ✅ | List past submissions |

### Courses
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/courses` | ❌ | List all courses |
| GET | `/api/courses?difficulty=BEGINNER` | ❌ | Filter by difficulty |
| GET | `/api/courses/{slug}` | ❌ | Get course detail with chapters |

### Exercises
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/exercises` | ❌ | List all exercises |
| GET | `/api/exercises?category=Arrays` | ❌ | Filter by category |
| GET | `/api/exercises/{slug}` | ❌ | Get exercise detail (with starter code) |
| POST | `/api/exercises/{slug}/submit` | ✅ | Submit code solution |

### Progress
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/progress` | ✅ | Get all course progress for current user |
| POST | `/api/progress/{courseSlug}/lessons/{lessonId}/complete` | ✅ | Mark a lesson complete |

### Leaderboard
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/leaderboard` | ❌ | Top 10 users by XP |

## Authentication Usage

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <token>
```

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret123","displayName":"Alice"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"alice","password":"secret123"}'
```

Both return:
```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "username": "alice",
  "email": "alice@example.com",
  "displayName": "Alice"
}
```

## Environment Variables (Production)

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_JWT_SECRET` | HS256 signing secret (≥32 chars) | *dev value in properties* |
| `APP_JWT_EXPIRATION_MS` | Token TTL in milliseconds | `604800000` (7 days) |
| `SPRING_DATASOURCE_URL` | Production DB JDBC URL | H2 in-memory |
| `SPRING_DATASOURCE_USERNAME` | DB username | `sa` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | *(empty)* |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins | `http://localhost:5173,...` |

Override in production via environment variables or a `application-prod.properties` profile:
```bash
SPRING_PROFILES_ACTIVE=prod \
APP_JWT_SECRET=your-very-long-prod-secret \
SPRING_DATASOURCE_URL=jdbc:postgresql://host/mqacademy \
mvn spring-boot:run
```

## CORS Configuration

Allowed origins are controlled via `app.cors.allowed-origins` in `application.properties` (comma-separated). The frontend at `http://localhost:5173` (Vite default) is allowed out of the box. For production, set the env variable to your frontend's actual domain.

## XP & Level System

| XP Range | Rank |
|----------|------|
| 0 – 499 | Novice |
| 500 – 1499 | Apprentice |
| 1500 – 2999 | Practitioner |
| 3000 – 5999 | Expert |
| 6000 – 11999 | Master |
| 12000 – 24999 | Grandmaster |
| 25000+ | Legend |

Level = `min(30, max(1, xp / 250))`
