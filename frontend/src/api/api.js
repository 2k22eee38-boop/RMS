import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(config => {
    const residentId = localStorage.getItem('residentId');
    if (residentId) {
        config.headers['Resident-Id'] = residentId;
    }
    return config;
});

export default api;
