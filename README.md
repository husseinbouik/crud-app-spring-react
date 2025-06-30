# CRUD Application - Spring Boot + React

A full-stack task management application built with Spring Boot backend and React frontend, featuring user authentication, project management, and task tracking.

## 🚀 Features

- **User Authentication**: Register, login, and password management
- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add tasks to projects with status tracking
- **Responsive UI**: Modern Material-UI interface
- **Real-time Updates**: Live data synchronization
- **Docker Support**: Containerized deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │  Spring Boot    │    │   React App     │
│   (Database)    │◄───┤   (Backend)     │◄───┤   (Frontend)    │
│   Port: 5432    │    │   Port: 8080    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.5.3** - Java framework
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Database
- **Flyway** - Database migrations
- **Spring Security** - Authentication
- **Maven** - Build tool

### Frontend
- **React 18** - UI framework
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Big Calendar** - Calendar component

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 15** or higher
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start with Docker

The easiest way to run the application is using Docker:

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd crud-app-spring-react
```

### 2. Start with Docker
```bash
docker-compose up --build
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

### 4. Default Credentials
- **Username**: alice
- **Password**: password123

## 🛠️ Local Development Setup

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Set up PostgreSQL Database**
   ```sql
   CREATE DATABASE crud_app_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE crud_app_db TO postgres;
   ```

3. **Update Database Configuration**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/crud_app_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

4. **Run the Application**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
crud-app-spring-react/
├── Backend/                          # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/hussein/Backend/
│   │       ├── controllers/          # REST Controllers
│   │       ├── services/             # Business Logic
│   │       ├── repositories/         # Data Access
│   │       ├── entities/             # JPA Entities
│   │       └── dto/                  # Data Transfer Objects
│   ├── src/main/resources/
│   │   ├── application.properties    # Configuration
│   │   └── db/migration/             # Flyway Migrations
│   └── Dockerfile                    # Backend Container
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   ├── pages/                    # Page Components
│   │   ├── services/                 # API Services
│   │   └── context/                  # React Context
│   ├── public/                       # Static Files
│   └── Dockerfile                    # Frontend Container
├── db/
│   └── schema.sql                    # Database Schema
├── docker-compose.yml                # Service Orchestration
└── README.md                         # This File
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## 🐳 Docker Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stop Services
```bash
# Stop services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild all services
docker-compose build --no-cache
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :8080
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check if postgres is running
   docker-compose ps
   # Check postgres logs
   docker-compose logs postgres
   ```

3. **Build Failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

4. **Frontend Not Loading**
   - Check if backend is running on port 8080
   - Verify API proxy configuration in nginx.conf
   - Check browser console for errors

### Reset Everything
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild everything
docker-compose up --build
```

## 🚀 Deployment

### Production Considerations

1. **Security**
   - Change default passwords
   - Use environment variables for sensitive data
   - Enable HTTPS

2. **Database**
   - Set up proper backup strategies
   - Configure connection pooling
   - Use production-grade PostgreSQL

3. **Monitoring**
   - Add health checks
   - Set up logging
   - Monitor resource usage

4. **Scaling**
   - Use Docker Swarm or Kubernetes
   - Implement load balancing
   - Set up auto-scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the logs using `docker-compose logs`
3. Create an issue in the repository
4. Contact the development team

---

**Happy Coding! 🎉** 