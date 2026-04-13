# Production Deployment Manual (Docker)

This manual explains how to deploy this project to production using Docker Compose.

The setup is intentionally simple:

- The frontend is built once into static files and served by Nginx.
- The backend runs as a Spring Boot container.
- PostgreSQL stores persistent data in a Docker volume.

That means production deployment is mostly about:

- setting the correct environment variables,
- building images with the right frontend API URL,
- exposing only the ports you actually want public,
- and putting TLS in front of the stack.

## 1. Architecture used in production

- `frontend`: static Vite build served by Nginx inside container (host `5173` -> container `8080`)
- `backend`: Spring Boot API (host `8081` -> container `8081`)
- `algo-compiler`: Flask API for algorithm execution (host `5000` -> container `5000`)
- `postgres`: PostgreSQL with persistent volume

Why this matters:

- The frontend talks to the backend through `VITE_API_BASE_URL`, which is baked into the build.
- The backend uses `APP_CORS_ALLOWED_ORIGINS` to allow the browser origin.
- The PostgreSQL volume keeps data even if containers are recreated.

Current runtime files:
- `docker-compose.yml`
- `Dockerfile`
- `Dockerfile.frontend`
- `.env`

## 2. Prerequisites on server

Install on a Linux VPS or VM:

### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S --needed docker docker-compose git curl ca-certificates

sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Log out and back in so the new group membership applies.

Verify:

```bash
docker --version
docker compose version
systemctl status docker
```

### Debian / Ubuntu

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

# Docker Compose plugin
sudo apt-get install -y docker-compose-plugin
```

Re-login after adding your user to `docker` group.

Verify:

```bash
docker --version
docker compose version
```

If `docker compose version` fails on Arch, install `docker-compose` explicitly. Some installs provide the plugin through the Docker package, while others expose it as a separate package.

## 3. Clone and prepare project

From here on, everything happens inside the project folder.

```bash
git clone <YOUR_REPOSITORY_URL> learningplusplus
cd learningplusplus
cp .env.example .env
```

## 4. Configure production environment

Edit `.env` with production values.

These are the only values that normally change between environments:

- `VITE_API_BASE_URL`: where the frontend should call the backend.
- `VITE_ALGO_COMPILER_URL`: where the frontend should call the algorithm compiler API.
- `APP_JWT_SECRET`: signing secret for auth tokens.
- `APP_CORS_ALLOWED_ORIGINS`: allowed browser origins.
- `ALGO_ALLOWED_ORIGIN`: browser origin allowed by the algorithm compiler CORS policy.
- `DB_PASSWORD`: database password.

Required keys:

```env
# Frontend build-time API URL (IMPORTANT: baked into frontend build)
VITE_API_BASE_URL=https://your-domain.com/api
VITE_ALGO_COMPILER_URL=https://your-domain.com/algo-api

# Backend
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
APP_JWT_SECRET=<VERY_LONG_RANDOM_SECRET>
APP_JWT_EXPIRATION_MS=604800000
APP_CORS_ALLOWED_ORIGINS=https://your-domain.com
ALGO_ALLOWED_ORIGIN=https://your-domain.com

# Database
DB_NAME=LearningDataBase
DB_USERNAME=anwer
DB_PASSWORD=<STRONG_DB_PASSWORD>
```

Notes:
- `VITE_API_BASE_URL` is build-time only. If you change it, rebuild frontend.
- Use a strong `APP_JWT_SECRET` (32+ chars, random).
- Never commit `.env` to git.

If you are using a real domain, set `VITE_API_BASE_URL` to the public API URL, not `localhost`.

## 5. Build and start production stack

This command builds both images and starts the services in detached mode.

```bash
docker compose up --build -d
```

Check status:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose logs -f algo-compiler
```

## 6. Health checks and smoke tests

Use these to confirm the deployment is actually serving traffic.

Backend health:

```bash
curl -fsS http://localhost:8081/actuator/health

Algorithm compiler health:

```bash
curl -fsS http://localhost:5000/health
```
```

Frontend:

```bash
curl -I http://localhost:5173
```

Expected:
- backend health returns JSON with status `UP`
- frontend returns `HTTP/1.1 200 OK`

If the frontend loads but API calls fail in the browser, the usual cause is a wrong `VITE_API_BASE_URL` or CORS origin.
If algorithm execution fails in the browser, verify `VITE_ALGO_COMPILER_URL` and `ALGO_ALLOWED_ORIGIN`.

## 7. Expose on real domain with HTTPS (recommended)

Use a reverse proxy (Nginx, Traefik, or Caddy) in front of Docker services.

Recommended production shape:

- Public site on `https://your-domain.com`
- Public API on `https://your-domain.com/api`
- Backend container only reachable on the private Docker host network or localhost

Recommended routing:
- `https://your-domain.com/` -> frontend `http://127.0.0.1:5173`
- `https://your-domain.com/api` -> backend `http://127.0.0.1:8081/api`
- `https://your-domain.com/actuator/health` -> optional restricted access

Then set:

```env
VITE_API_BASE_URL=https://your-domain.com/api
APP_CORS_ALLOWED_ORIGINS=https://your-domain.com
```

Rebuild and restart after changing `.env`:

```bash
docker compose up --build -d
```

## 8. Update deployment (new release)

This is the normal upgrade path for a new production release.

```bash
git pull
docker compose up --build -d
```

Optional cleanup:

```bash
docker image prune -f
```

## 9. Database backup and restore

Backups are the part people usually skip until they need them. Do not skip them.

Backup:

```bash
docker compose exec -T postgres pg_dump -U "$DB_USERNAME" "$DB_NAME" > backup_$(date +%F).sql
```

Restore:

```bash
cat backup_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U "$DB_USERNAME" -d "$DB_NAME"
```

## 10. Rollback strategy

If a deployment fails:

1. Checkout previous git tag/commit.
2. Redeploy with rebuild.

```bash
git checkout <PREVIOUS_TAG_OR_COMMIT>
docker compose up --build -d
```

Keep at least one known-good tag or commit hash handy so rollback is immediate.

## 11. Common production issues

### Frontend points to wrong API URL
Cause: `VITE_API_BASE_URL` changed without rebuild.
Fix: update `.env` and run `docker compose up --build -d`.

### CORS errors in browser
Cause: wrong `APP_CORS_ALLOWED_ORIGINS`.
Fix: set exact frontend origin in `.env` and restart backend.

### Backend cannot connect to DB
Cause: bad DB credentials or URL.
Fix: verify `DB_*` / `SPRING_DATASOURCE_*` values and check postgres logs.

### Frontend returns 200 but app shows API errors
Cause: frontend was built with the wrong API base URL.
Fix: update `VITE_API_BASE_URL`, rebuild frontend, and redeploy.

### Containers keep restarting after an update
Cause: usually bad env values, bad image tag, or a stale local image.
Fix: inspect `docker compose logs`, verify the env file, then rebuild with `--no-cache` if needed.

## 12. Security checklist before go-live

- Use strong secrets and DB passwords.
- Put app behind HTTPS only.
- Restrict exposed ports with firewall (only 80/443 public).
- Keep Docker and host packages updated.
- Store backups off-server.
- Consider non-default DB username in production.

On Arch, use `ufw` or `firewalld` only if it matches your host setup. If you already manage firewall rules elsewhere, keep them consistent with the ports you expose.

---

If you want, I can also generate a ready-to-use Nginx reverse-proxy config for your exact domain and SSL setup.