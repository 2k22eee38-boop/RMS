import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rms-dwkl.onrender.com',
});

api.interceptors.request.use(config => {
    const residentId = localStorage.getItem('residentId');
    if (residentId) {
        config.headers['Resident-Id'] = residentId;
    }
    return config;
});

export default api;
