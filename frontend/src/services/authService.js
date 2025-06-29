import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Spring backend URL

const authService = {
    async register(username, email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username: username,
                email: email,
                password: password
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: username,
                password: password
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getUserInfo(token) {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;