import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import './App.css'; //Optional
import AddTaskPage from './components/AddTaskPage';
import EditTaskPage from './components/EditTaskPage';
import EditProjectPage from './components/EditProjectPage';
import ProjectList from './components/Project/ProjectList';
import TaskList from './components/Task/TaskList';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="add-task" element={<AddTaskPage />} />
            <Route path="edit-task/:id" element={<EditTaskPage />} />
            <Route path="edit-project/:id" element={<EditProjectPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;