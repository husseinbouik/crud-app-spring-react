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
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SidebarComponent />
      <DashboardStack>
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }} />
        
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's an overview of your projects and tasks.
            </Typography>
          </Box>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Analytics Cards */}
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
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{completedTasks}</Typography>
                <Typography variant="body2" color="textSecondary">Completed Tasks</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{pendingTasks}</Typography>
                <Typography variant="body2" color="textSecondary">Pending Tasks</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{completionRate}%</Typography>
                <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs for Tasks and Projects */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label={`Tasks (${totalTasks})`} />
              <Tab label={`Projects (${totalProjects})`} />
            </Tabs>
            <Divider />
            
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <TaskList
                  tasks={tasks}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onView={handleViewTask}
                />
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <ProjectList
                  projects={projects}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                  onView={handleViewProject}
                />
              </Box>
            )}
          </Paper>
        </Container>

        {/* Floating Action Button */}
        <FloatingActionButton
          color="primary"
          aria-label="add"
          onClick={activeTab === 0 ? handleAddTask : handleAddProject}
        >
          <AddIcon />
        </FloatingActionButton>

        {/* Add Item Dialog */}
        <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Add New {addDialogType === 'task' ? 'Task' : 'Project'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />
            {addDialogType === 'task' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Project</InputLabel>
                <Select
                  value={newItem.projectId}
                  label="Project"
                  onChange={(e) => setNewItem({ ...newItem, projectId: e.target.value })}
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
          <DialogActions>
            <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateItem} variant="contained">
              Create {addDialogType === 'task' ? 'Task' : 'Project'}
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardStack>
    </AppTheme>
  );
}

export default Dashboard;