import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    LinearProgress,
    Alert,
    Fab,
    Tooltip,
    Container,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Assignment as TaskIcon,
    Folder as ProjectIcon,
    CalendarToday as CalendarIcon,
    Flag as StatusIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import TaskViewModal from './TaskViewModal';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        projectId: ''
    });
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAllProjects();
            setProjects(response.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    };

    const handleOpenDialog = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status || 'pending',
                projectId: task.projectId || ''
            });
        } else {
            setEditingTask(null);
            setFormData({ title: '', description: '', status: 'pending', projectId: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', status: 'pending', projectId: '' });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, formData);
                setSuccess('Task updated successfully!');
            } else {
                await taskService.createTask(formData);
                setSuccess('Task created successfully!');
            }
            handleCloseDialog();
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(taskId);
                setSuccess('Task deleted successfully!');
                fetchTasks();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedTask(null);
    };

    const handleEditTask = (task) => {
        navigate(`/edit-task/${task.id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in progress': return 'info';
            case 'completed': return 'success';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in progress': return 'In Progress';
            case 'completed': return 'Completed';
            default: return status;
        }
    };

    const getProjectName = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : 'No Project';
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Loading tasks...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

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
                        Tasks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your tasks and track progress
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
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
            </Box>

            {tasks.length === 0 ? (
                <Card sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: 2,
                    border: 1,
                    borderColor: 'divider',
                    background: (theme) => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                        : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)'
                }}>
                    <CardContent>
                        <TaskIcon sx={{ 
                            fontSize: 64, 
                            color: 'text.secondary', 
                            mb: 2,
                            opacity: 0.6
                        }} />
                        <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                            No tasks found
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                            Get started by creating your first task. Tasks help you organize and track your work effectively.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ 
                                borderRadius: 2,
                                px: 4,
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
                            Create Your First Task
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: (theme) => theme.palette.mode === 'dark' 
                                            ? '0 20px 40px rgba(0,0,0,0.4)' 
                                            : '0 20px 40px rgba(0,0,0,0.15)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 4,
                                        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    },
                                    '&:hover::before': {
                                        opacity: 1,
                                    }
                                }}
                            >
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    p: 3,
                                    '&:last-child': { pb: 3 }
                                }}>
                                    {/* Header with title and actions */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start', 
                                        mb: 2 
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            component="h2" 
                                            sx={{ 
                                                fontWeight: 600,
                                                lineHeight: 1.3,
                                                color: 'text.primary',
                                                flex: 1,
                                                pr: 1
                                            }}
                                        >
                                            {task.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="View Details">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary" 
                                                    onClick={() => handleViewTask(task)}
                                                    sx={{ 
                                                        '&:hover': { 
                                                            backgroundColor: 'primary.light',
                                                            color: 'primary.contrastText'
                                                        }
                                                    }}
                                                >
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Task">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleEditTask(task)}
                                                    sx={{ 
                                                        '&:hover': { 
                                                            backgroundColor: 'primary.light',
                                                            color: 'primary.contrastText'
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Task">
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDelete(task.id)}
                                                    sx={{ 
                                                        '&:hover': { 
                                                            backgroundColor: 'error.light',
                                                            color: 'error.contrastText'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    {/* Description */}
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ 
                                            mb: 3,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.5,
                                            minHeight: '4.5em'
                                        }}
                                    >
                                        {task.description || 'No description provided'}
                                    </Typography>

                                    {/* Status Chip */}
                                    <Box sx={{ mb: 2 }}>
                                        <Chip 
                                            label={getStatusLabel(task.status)}
                                            color={getStatusColor(task.status)}
                                            size="small"
                                            variant="outlined"
                                            icon={<StatusIcon />}
                                        />
                                    </Box>

                                    {/* Task metadata */}
                                    <Box sx={{ mt: 'auto' }}>
                                        {/* Project info */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 1.5,
                                            p: 1,
                                            borderRadius: 1,
                                            backgroundColor: 'action.hover'
                                        }}>
                                            <ProjectIcon sx={{ 
                                                fontSize: 16, 
                                                mr: 1, 
                                                color: 'primary.main' 
                                            }} />
                                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                                                {getProjectName(task.projectId)}
                                            </Typography>
                                        </Box>

                                        {/* Date info */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            p: 1,
                                            borderRadius: 1,
                                            backgroundColor: 'action.hover'
                                        }}>
                                            <CalendarIcon sx={{ 
                                                fontSize: 16, 
                                                mr: 1, 
                                                color: 'primary.main' 
                                            }} />
                                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                                                Created {formatDate(task.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Task Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
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
                        {editingTask ? 'Edit Task' : 'Add New Task'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {editingTask ? 'Update your task details' : 'Create a new task to track your work'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Task Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Project</InputLabel>
                            <Select
                                name="projectId"
                                value={formData.projectId}
                                label="Project"
                                onChange={handleInputChange}
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
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                label="Status"
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ 
                        p: 3, 
                        pt: 1,
                        borderTop: 1,
                        borderColor: 'divider'
                    }}>
                        <Button 
                            onClick={handleCloseDialog}
                            variant="outlined"
                            sx={{ 
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            sx={{ 
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600
                            }}
                        >
                            {editingTask ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* View Modal */}
            <TaskViewModal
                open={viewModalOpen}
                onClose={handleCloseViewModal}
                task={selectedTask}
                projectName={selectedTask ? getProjectName(selectedTask.projectId) : ''}
            />
        </Container>
    );
};

export default TaskList;