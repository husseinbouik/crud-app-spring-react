import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Spring backend URL

const projectService = {
    async getAllProjects() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createProject(projectData) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/projects`, projectData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getProjectById(projectId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateProject(projectId, projectData) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/projects/${projectId}`, projectData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteProject(projectId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default projectService; 