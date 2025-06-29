import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  CheckCircle as CompletedIcon,
  HourglassEmpty as PendingIcon,
  TrendingUp as InProgressIcon
} from '@mui/icons-material';

const TaskViewModal = ({ open, onClose, task }) => {
  if (!task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CompletedIcon color="success" />;
      case 'in progress':
        return <InProgressIcon color="primary" />;
      default:
        return <PendingIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '50vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="outlined"
          size="small"
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Task Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Task Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 3 }}>
                  {task.description || 'No description provided'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getStatusIcon(task.status)}
                  <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
                    Status
                  </Typography>
                </Box>
                <Box sx={{ pl: 3 }}>
                  <Chip 
                    label={getStatusLabel(task.status)} 
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Created
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 3 }}>
                  {formatDate(task.createdAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Project Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Project Information
              </Typography>
              
              {task.projectName ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ProjectIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2" color="textSecondary">
                      Project
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 3, mb: 2 }}>
                    {task.projectName}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Project ID
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ pl: 3, color: 'text.secondary' }}>
                    #{task.projectId}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <ProjectIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No project assigned
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    This task is not linked to any project
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskViewModal; 