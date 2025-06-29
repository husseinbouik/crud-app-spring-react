import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Assignment as TaskIcon,
  Description as DescriptionIcon,
  Folder as ProjectIcon,
  Flag as StatusIcon,
} from '@mui/icons-material';
import projectService from '../../services/projectService';

function TaskForm({ onSubmit, onClose, initialTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending'); // Default status
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'pending');
      setProjectId(initialTask.projectId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setProjectId('');
    }
  }, [initialTask]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const taskData = {
      id: initialTask?.id, // Include ID for updates
      title,
      description,
      status,
      projectId: projectId || null, // Include project ID
    };
    onSubmit(taskData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Loading projects...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Title Field */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TaskIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Task Title
            </Typography>
          </Box>
          <TextField
            autoFocus
            fullWidth
            label="Enter task title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        {/* Description Field */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DescriptionIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Enter task description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        {/* Project Selection */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ProjectIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Project
            </Typography>
          </Box>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="project-label">Select project</InputLabel>
            <Select
              labelId="project-label"
              id="project"
              value={projectId}
              label="Select project"
              onChange={(e) => setProjectId(e.target.value)}
              sx={{
                borderRadius: 2,
              }}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Selection */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StatusIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
          </Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-label">Select status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              label="Select status"
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status Preview */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
              Current Status:
            </Typography>
            <Chip 
              label={status.charAt(0).toUpperCase() + status.slice(1)} 
              color={getStatusColor(status)}
              size="small"
              variant="outlined"
            />
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <Button 
              onClick={onClose} 
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              startIcon={<SaveIcon />}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              {initialTask ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TaskForm;