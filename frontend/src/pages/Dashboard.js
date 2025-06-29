import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  LinearProgress,
} from '@mui/material';
import TaskList from '../components/Task/TaskList';
import ProjectList from '../components/Project/ProjectList';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import AddIcon from '@mui/icons-material/Add';
import TaskIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import OverdueIcon from '@mui/icons-material/Warning';
import ProjectIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AppTheme from '../components/shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeSelect from '../components/shared-theme/ColorModeSelect';
import SidebarComponent from '../components/layout/Sidebar';

const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  borderRadius: 3,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const DashboardStack = styled(Box)(({ theme }) => ({
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

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

// Custom styled cards for dashboard
const DashboardTaskCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(144, 202, 249, 0.08)' // Light blue tint in dark mode
    : 'rgba(144, 202, 249, 0.05)', // Very light blue tint in light mode
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(144, 202, 249, 0.2)' 
    : 'rgba(144, 202, 249, 0.15)'}`,
  borderRadius: 3,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(144, 202, 249, 0.12)' 
      : 'rgba(144, 202, 249, 0.08)',
  },
}));

const DashboardProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(156, 204, 101, 0.08)' // Light green tint in dark mode
    : 'rgba(156, 204, 101, 0.05)', // Very light green tint in light mode
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(156, 204, 101, 0.2)' 
    : 'rgba(156, 204, 101, 0.15)'}`,
  borderRadius: 3,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(156, 204, 101, 0.12)' 
      : 'rgba(156, 204, 101, 0.08)',
  },
}));

// Custom Dashboard Task List Component
const DashboardTaskList = ({ tasks, onDelete, onEdit, onView }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <DashboardTaskCard>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1 }}>
                  {task.title}
                </Typography>
                <Box>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onView(task)}
                      sx={{ color: 'primary.main' }}
                    >
                      <TaskIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {task.description || 'No description provided'}
              </Typography>

              <Box display="flex" alignItems="center" mb={1}>
                <ProjectIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="textSecondary">
                  {task.projectName || 'No project assigned'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="textSecondary">
                  {formatDate(task.createdAt)}
                </Typography>
              </Box>

              <Chip 
                label={getStatusLabel(task.status)}
                color={getStatusColor(task.status)}
                size="small"
              />
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Box>
                <Tooltip title="Edit Task">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(task)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(task.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </DashboardTaskCard>
        </Grid>
      ))}
    </Grid>
  );
};

// Custom Dashboard Project List Component
const DashboardProjectList = ({ projects, onDelete, onEdit, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Grid container spacing={2}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <DashboardProjectCard>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1 }}>
                  {project.name}
                </Typography>
                <Box>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onView(project)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ProjectIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {project.description || 'No description provided'}
              </Typography>

              {project.userName && (
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="textSecondary">
                    {project.userName}
                  </Typography>
                </Box>
              )}

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="textSecondary">
                  {formatDate(project.createdAt)}
                </Typography>
              </Box>

              {project.tasks && project.tasks.length > 0 && (
                <Chip 
                  label={`${project.tasks.length} task${project.tasks.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Box>
                <Tooltip title="Edit Project">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(project)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Project">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(project.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </DashboardProjectCard>
        </Grid>
      ))}
    </Grid>
  );
};

function Dashboard(props) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addDialogType, setAddDialogType] = useState('task');
  const [newItem, setNewItem] = useState({ title: '', description: '', projectId: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([
        taskService.getAllTasks(),
        projectService.getAllProjects()
      ]);
      
      setTasks(tasksResponse.data);
      setProjects(projectsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard - Error fetching data:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        let errorMessage = 'Failed to fetch data.';
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  // Analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && task.status !== 'completed';
  }).length;
  
  const totalProjects = projects.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const tasksDueToday = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const handleAddTask = () => {
    setAddDialogType('task');
    setShowAddDialog(true);
  };

  const handleAddProject = () => {
    setAddDialogType('project');
    setShowAddDialog(true);
  };

  const handleCreateItem = async () => {
    try {
      if (addDialogType === 'task') {
        await taskService.createTask(newItem);
        setSuccessMessage('Task created successfully!');
      } else {
        await projectService.createProject(newItem);
        setSuccessMessage('Project created successfully!');
      }
      
      setShowAddDialog(false);
      setNewItem({ title: '', description: '', projectId: '' });
      fetchData(); // Refresh data
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to create item. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setSuccessMessage('Task deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete task.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectService.deleteProject(id);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      setSuccessMessage('Project deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete project.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleEditTask = (task) => {
    navigate(`/edit-task/${task.id}`);
  };

  const handleEditProject = (project) => {
    navigate(`/edit-project/${project.id}`);
  };

  const handleViewTask = (task) => {
    // Enhanced view with modal or dedicated page
    alert(`Viewing task: ${task.title}`);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    // Could open a modal or navigate to project detail page
  };

  if (loading) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your workspace...
          </Typography>
        </Box>
      </AppTheme>
    );
  }

  if (error) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
        </Box>
      </AppTheme>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: 1,
            border: 1,
            borderColor: 'divider'
          }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overview of your projects and tasks
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTask}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add Task
              </Button>
              <Button
                variant="outlined"
                startIcon={<ProjectIcon />}
                onClick={handleAddProject}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add Project
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Tasks
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totalTasks}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <TaskIcon />
                    </Avatar>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionRate} 
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {completionRate}% completed
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Projects
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totalProjects}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <ProjectIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Active projects
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Due Today
                      </Typography>
                      <Typography variant="h4" component="div">
                        {tasksDueToday}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <CalendarTodayIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Tasks due today
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Overdue
                      </Typography>
                      <Typography variant="h4" component="div">
                        {overdueTasks}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <OverdueIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Tasks overdue
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 2,
                border: 1,
                borderColor: 'divider'
              }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{completedTasks}</Typography>
                <Typography variant="body2" color="textSecondary">Completed Tasks</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 2,
                border: 1,
                borderColor: 'divider'
              }}>
                <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{pendingTasks}</Typography>
                <Typography variant="body2" color="textSecondary">Pending Tasks</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 2,
                border: 1,
                borderColor: 'divider'
              }}>
                <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{completionRate}%</Typography>
                <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs for Tasks and Projects */}
          <Paper sx={{ 
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 2,
            border: 1,
            borderColor: 'divider'
          }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label={`Tasks (${totalTasks})`} />
              <Tab label={`Projects (${totalProjects})`} />
            </Tabs>
            <Divider />
            
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <DashboardTaskList
                  tasks={tasks}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onView={handleViewTask}
                />
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <DashboardProjectList
                  projects={projects}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                  onView={handleViewProject}
                />
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Add Item Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={() => setShowAddDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 8,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New {addDialogType === 'task' ? 'Task' : 'Project'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {addDialogType === 'task' ? 'Create a new task' : 'Create a new project'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          {addDialogType === 'task' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={newItem.projectId}
                label="Project"
                onChange={(e) => setNewItem({ ...newItem, projectId: e.target.value })}
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
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          pt: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Button 
            onClick={() => setShowAddDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateItem} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Create {addDialogType === 'task' ? 'Task' : 'Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;