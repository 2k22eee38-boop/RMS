import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            const { id, role } = response.data;
            
            if (role === 'MANAGER') {
                navigate('/manager');
            } else if (role === 'RESIDENT') {
                localStorage.setItem('residentId', id);
                navigate('/resident');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="app-container login-page">
            <div className="card auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '800' }}>RMS Login</h2>
                {error && <div className="status-badge status-REJECTED" style={{ width: '100%', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Login to Dashboard</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
