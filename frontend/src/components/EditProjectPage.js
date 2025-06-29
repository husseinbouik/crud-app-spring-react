// EditProjectPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Alert, 
  Box, 
  Card, 
  CardContent,
  Divider,
  CircularProgress,
  Button,
  TextField
} from '@mui/material';
import { useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectById(id);
        setProject(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch project.');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await projectService.updateProject(id, formData);
      setSuccessMessage('Project updated successfully!');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } catch (error) {
      console.error('Error updating project:', error);
      setErrorMessage('Failed to update project. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    navigate('/projects');
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
              Loading project...
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
          Edit Project
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

      {/* Project Form Card */}
      {project && (
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
              Project Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                autoFocus
                fullWidth
                name="name"
                label="Project Name"
                variant="outlined"
                value={formData.name}
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
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button 
                  onClick={handleCancel} 
                  variant="outlined"
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
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600
                  }}
                >
                  Update Project
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default EditProjectPage; 