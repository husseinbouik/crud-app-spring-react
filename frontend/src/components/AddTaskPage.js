// AddTaskPage.js
import React, { useState } from 'react';
import { Container, Typography, Alert, Box } from '@mui/material';
import TaskForm from '../components/Task/TaskForm';
import taskService from '../services/taskService';
import AppTheme from './shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from './shared-theme/ColorModeSelect';
import { styled } from '@mui/material/styles';
import NavbarComponent from './layout/Sidebar'; // Import Navbar
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddTaskPageStack = styled(Box)(({ theme }) => ({
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
    <AppTheme>
        <NavbarComponent />
      <CssBaseline enableColorScheme />
      <AddTaskPageStack direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Add New Task
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TaskForm onSubmit={handleSubmit} onClose={handleCancel} />
            {/* <Button variant="contained" color="secondary" onClick={handleCancel}>
                Cancel
            </Button> */}
        </Container>
      </AddTaskPageStack>
    </AppTheme>
  );
}

export default AddTaskPage;