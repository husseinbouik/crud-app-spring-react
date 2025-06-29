// EditTaskPage.js
import React, { useState, useEffect } from 'react';
import TaskForm from '../components/Task/TaskForm';
import { Container, Typography, Alert, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import taskService from '../services/taskService';
import AppTheme from './shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from './shared-theme/ColorModeSelect';
import { styled } from '@mui/material/styles';
import NavbarComponent from './layout/Sidebar'; // Import Navbar
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditTaskPageStack = styled(Box)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

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
    return <p>Loading task...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <AppTheme>
        <NavbarComponent /> 
      <CssBaseline enableColorScheme />
      <EditTaskPageStack direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Edit Task
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {task && (
            <TaskForm
              onSubmit={handleSubmit}
              onClose={handleCancel}
              initialTask={task}
            />
          )}
            {/* <Button variant="contained" color="secondary" onClick={handleCancel}>
                Cancel
            </Button> */}
        </Container>
      </EditTaskPageStack>
    </AppTheme>
  );
}

export default EditTaskPage;