import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Spring backend URL

const userService = {
    async getAllUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateUser(userId, userData) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
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

    async deleteUser(userId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
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

export default userService; 