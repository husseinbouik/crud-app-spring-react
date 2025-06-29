// EditTaskPage.js
import React, { useState, useEffect } from 'react';
import TaskForm from '../components/Task/TaskForm';
import { 
  Container, 
  Typography, 
  Alert, 
  Box, 
  Card, 
  CardContent,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import taskService from '../services/taskService';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function EditTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await taskService.getTaskById(id);
        setTask(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch task.');
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (updatedTask) => {
    try {
      await taskService.updateTask(id, updatedTask);
      setSuccessMessage('Task updated successfully!');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('Failed to update task. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading task...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
        </Alert>
        <Button variant="contained" onClick={handleCancel}>
          Go Back
        </Button>
      </Container>
    );
  }

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
          Edit Task
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
      {task && (
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
            <TaskForm
              onSubmit={handleSubmit}
              onClose={handleCancel}
              initialTask={task}
            />
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default EditTaskPage;