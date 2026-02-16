# 🐳 Docker Deployment Guide

## Quick Start with Docker Compose

Run both frontend and backend with a single command:

```bash
# From the project root directory
docker-compose up --build
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Backend Health: http://localhost:8000/health

---

## Prerequisites

1. **Docker & Docker Compose installed**
   - Docker Desktop (Mac/Windows): https://www.docker.com/products/docker-desktop
   - Docker Engine (Linux): https://docs.docker.com/engine/install/

2. **Environment Variables configured**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Twilio credentials
   
   # Frontend environment
   cp context-connect/.env.example context-connect/.env
   # Edit if needed (default: http://localhost:8000)
   ```

---

## Docker Compose Commands

### Start Services
```bash
# Build and start (foreground)
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# Start specific service
docker-compose up backend
docker-compose up frontend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Services
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up --build
```

---

## Individual Container Commands

### Backend Only
```bash
cd backend

# Build
docker build -t numer-backend .

# Run
docker run -p 8000:8000 --env-file .env numer-backend

# Run with custom port
docker run -p 3000:8000 --env-file .env numer-backend
```

### Frontend Only
```bash
cd context-connect

# Build
docker build -t numer-frontend .

# Run
docker run -p 5173:80 numer-frontend

# Run with custom port
docker run -p 8080:80 numer-frontend
```

---

## Environment Variables in Docker

### Method 1: .env file (Recommended)
```bash
# backend/.env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Method 2: Command line
```bash
docker run -p 8000:8000 \
  -e TWILIO_ACCOUNT_SID=your_sid \
  -e TWILIO_AUTH_TOKEN=your_token \
  numer-backend
```

### Method 3: Docker Compose environment
Edit `docker-compose.yml`:
```yaml
services:
  backend:
    environment:
      - TWILIO_ACCOUNT_SID=your_sid
      - TWILIO_AUTH_TOKEN=your_token
```

---

## Health Checks

Docker Compose includes health checks for the backend:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect numer-backend | grep -A 10 Health
```

**Health check endpoint:** http://localhost:8000/health

---

## Networking

Services communicate via `numer-network`:
- Backend: `backend:8000` (internal)
- Frontend: `frontend:80` (internal)

**External access:**
- Frontend: `localhost:5173` → `frontend:80`
- Backend: `localhost:8000` → `backend:8000`

---

## Production Deployment

### Build for Production
```bash
# Build production images
docker-compose build

# Tag for registry
docker tag numer-backend:latest your-registry/numer-backend:v1.0.0
docker tag numer-frontend:latest your-registry/numer-frontend:v1.0.0

# Push to registry
docker push your-registry/numer-backend:v1.0.0
docker push your-registry/numer-frontend:v1.0.0
```

### Production Environment Variables
```bash
# backend/.env.production
NODE_ENV=production
PORT=8000
TWILIO_ACCOUNT_SID=your_production_sid
TWILIO_AUTH_TOKEN=your_production_token
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -ti:8000
lsof -ti:5173

# Kill process
lsof -ti:8000 | xargs kill -9
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend
```

### Clear Everything and Rebuild
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi numer-backend numer-frontend

# Rebuild from scratch
docker-compose up --build
```

### Backend Can't Connect to Twilio
- Check `backend/.env` has correct credentials
- Verify container has internet access
- Check logs: `docker-compose logs backend`

### Frontend Can't Connect to Backend
- Verify backend is running: `docker-compose ps`
- Check backend health: `curl http://localhost:8000/health`
- Verify CORS settings in backend/.env

---

## Docker Image Sizes

**Backend:** ~200MB (Node.js Alpine)
**Frontend:** ~50MB (Nginx Alpine with built assets)

---

## Advanced Configuration

### Custom Docker Compose File
```bash
# Use custom compose file
docker-compose -f docker-compose.custom.yml up

# Use multiple compose files
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Resource Limits
Edit `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Persistent Logs
```yaml
services:
  backend:
    volumes:
      - ./logs:/app/logs
```

---

## Monitoring

### Container Stats
```bash
# Real-time stats
docker stats

# Specific container
docker stats numer-backend
```

### Container Inspection
```bash
# Full container details
docker inspect numer-backend

# Network details
docker network inspect numer-network
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View logs |
| `docker-compose ps` | List services |
| `docker-compose restart` | Restart services |
| `docker-compose build` | Rebuild images |

---

**Need help?** Check the main [README.md](README.md) or [QUICK_START.md](QUICK_START.md)
