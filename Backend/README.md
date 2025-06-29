# CRUD App Backend

A Spring Boot application providing RESTful APIs for managing users, projects, and tasks.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

## Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Default port: 5432
   - Default superuser: postgres

2. **Create Database**
   ```sql
   -- Connect to PostgreSQL as superuser
   psql -U postgres
   
   -- Create the database
   CREATE DATABASE crud_app_db;
   
   -- Exit psql
   \q
   ```

   Or run the setup script:
   ```bash
   psql -U postgres -f setup-database.sql
   ```

3. **Database Configuration**
   - Database URL: `jdbc:postgresql://localhost:5432/crud_app_db`
   - Username: `postgres`
   - Password: `postgres` (change in application.properties if different)

## Running the Application

1. **Clone and navigate to the project**
   ```bash
   cd Backend
   ```

2. **Compile the project**
   ```bash
   mvn clean compile
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Database Migration

The application uses Flyway for database migrations. The initial schema is automatically created when the application starts.

## Troubleshooting

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check database credentials in `application.properties`
   - Verify database `crud_app_db` exists

2. **Port Already in Use**
   - Change port in `application.properties`: `server.port=8081`

3. **Compilation Errors**
   - Ensure Java 17+ is installed
   - Run `mvn clean compile` to rebuild

## Sample Data

The application includes sample data:
- Users: alice, bob
- Projects: Personal, Work, Reading
- Tasks: Various sample tasks

## CORS Configuration

The application is configured to allow requests from `http://localhost:3000` for frontend integration. 