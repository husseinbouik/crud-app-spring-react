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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Description as DescriptionIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ProjectViewModal = ({ open, onClose, project }) => {
  if (!project) return null;

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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>
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
          {/* Project Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Project Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 3 }}>
                  {project.description || 'No description provided'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {project.userName && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" color="textSecondary">
                      Owner
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 3 }}>
                    {project.userName}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Created
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 3 }}>
                  {formatDate(project.createdAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Tasks List */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tasks ({project.tasks?.length || 0})
                </Typography>
              </Box>

              {project.tasks && project.tasks.length > 0 ? (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {project.tasks.map((task) => (
                    <ListItem key={task.id} sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      mb: 1,
                      backgroundColor: 'background.paper'
                    }}>
                      <ListItemIcon>
                        <TaskIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {task.title}
                            </Typography>
                            <Chip 
                              label={task.status} 
                              size="small"
                              color={task.status === 'completed' ? 'success' : 
                                     task.status === 'in progress' ? 'primary' : 'default'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                              {task.description || 'No description'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Created: {formatDate(task.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <TaskIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No tasks in this project yet
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Create tasks to get started
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

export default ProjectViewModal; 