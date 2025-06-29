CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, password, email) VALUES
('alice', 'password123', 'alice@example.com'),
('bob', 'password456', 'bob@example.com');

INSERT INTO projects (name, description, user_id) VALUES
('Personal', 'Personal tasks and reminders', 1),
('Work', 'Work-related projects', 1),
('Reading', 'Books to read', 2);

INSERT INTO tasks (title, description, status, project_id) VALUES
('Buy groceries', 'Milk, Bread, Eggs', 'pending', 1),
('Finish project', 'Complete the Spring Boot backend', 'in progress', 2),
('Read a book', 'Read Clean Code by Robert C. Martin', 'pending', 3); 