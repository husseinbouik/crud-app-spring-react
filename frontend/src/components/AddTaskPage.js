// AddTaskPage.js
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Alert, 
  Box, 
  Card, 
  CardContent,
  Paper,
  Divider
} from '@mui/material';
import TaskForm from '../components/Task/TaskForm';
import taskService from '../services/taskService';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function AddTaskPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (newTask) => {
    try {
      await taskService.createTask(newTask);
      setSuccessMessage('Task created successfully!');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage('Failed to create task. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={handleCancel}
          sx={{ mr: 2, color: 'text.secondary' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Add New Task
        </Typography>
      </Box>

      {/* Alerts */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Task Form Card */}
      <Card 
        sx={{ 
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 3, 
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            Task Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <TaskForm onSubmit={handleSubmit} onClose={handleCancel} />
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddTaskPage;