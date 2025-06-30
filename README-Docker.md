# Docker Setup for CRUD Application

This document explains how to run the Spring Boot + React CRUD application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd crud-app-spring-react
   ```

2. **Build and run the entire application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Individual Service Commands

### Build and run all services
```bash
docker-compose up --build
```

### Run in detached mode (background)
```bash
docker-compose up -d --build
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Rebuild a specific service
```bash
docker-compose build backend
docker-compose build frontend
```

## Service Details

### PostgreSQL Database
- **Port**: 5432
- **Database**: crud_app_db
- **Username**: postgres
- **Password**: postgres
- **Data persistence**: Yes (Docker volume)

### Spring Boot Backend
- **Port**: 8080
- **Profile**: docker
- **Database connection**: Automatically configured for Docker environment

### React Frontend
- **Port**: 3000
- **Nginx**: Serves the built React app
- **API proxy**: Automatically proxies `/api/*` requests to backend

## Development Workflow

### Making Changes

1. **Backend changes**:
   ```bash
   # Rebuild and restart backend only
   docker-compose build backend
   docker-compose up backend
   ```

2. **Frontend changes**:
   ```bash
   # Rebuild and restart frontend only
   docker-compose build frontend
   docker-compose up frontend
   ```

3. **Database changes**:
   - Update `db/schema.sql`
   - Restart the postgres service:
   ```bash
   docker-compose restart postgres
   ```

### Hot Reloading (Development)

For development with hot reloading, you can run services individually:

```bash
# Run only database
docker-compose up postgres

# Run backend locally (with hot reload)
cd Backend
./mvnw spring-boot:run

# Run frontend locally (with hot reload)
cd frontend
npm start
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -ano | findstr :8080
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database connection issues**:
   ```bash
   # Check if postgres is running
   docker-compose ps
   # Check postgres logs
   docker-compose logs postgres
   ```

3. **Build failures**:
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild everything
docker-compose up --build
```

## Environment Variables

You can customize the setup by creating a `.env` file in the root directory:

```env
POSTGRES_DB=crud_app_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

## Production Deployment

For production deployment, consider:

1. **Security**: Change default passwords
2. **SSL**: Add SSL certificates
3. **Monitoring**: Add health checks and monitoring
4. **Scaling**: Use Docker Swarm or Kubernetes
5. **Backup**: Set up database backup strategies

## File Structure

```
crud-app-spring-react/
├── Backend/
│   ├── Dockerfile
│   └── src/main/resources/application-docker.properties
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── db/
│   └── schema.sql
├── docker-compose.yml
├── .dockerignore
└── README-Docker.md
``` 