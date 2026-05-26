# Orbit SaaS

A full-stack SaaS starter with a Laravel API backend and React frontend, fully containerised with Docker.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Laravel 13, PHP 8.3, Sanctum, MySQL 8  |
| Frontend  | React 19, Vite, react-router-dom v7    |
| Infra     | Docker Compose, Nginx, Redis           |

---

## Project Structure

```
orbit-saas/
├── backend/          # Laravel API
├── frontend/         # React + Vite SPA
├── docker/           # Nginx & PHP Dockerfiles
└── docker-compose.yml
```

---

## Docker Setup

Copy the environment file and configure as needed before first run:

```bash
cp backend/.env.example backend/.env
```

Key defaults defined in `docker-compose.yml`:

| Service  | Host port | Purpose           |
|----------|-----------|-------------------|
| nginx    | 8000      | Laravel API proxy |
| mysql    | 3307      | MySQL 8 database  |
| redis    | 6379      | Cache / queues    |
| frontend | 5173      | Vite dev server   |

---

## Run Commands

**Start all services**
```bash
docker compose up -d
```

**Run Laravel migrations & seeders**
```bash
docker compose exec backend php artisan migrate --seed
```

**Generate app key (first run)**
```bash
docker compose exec backend php artisan key:generate
```

**Stop all services**
```bash
docker compose down
```

**Frontend (outside Docker)**
```bash
cd frontend
npm install
npm run dev
```

**Backend (outside Docker)**
```bash
cd backend
composer install
php artisan serve
```
