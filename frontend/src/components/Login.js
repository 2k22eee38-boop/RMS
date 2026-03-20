import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, Building2, ShieldCheck, Clock } from 'lucide-react';
import api from '../api/api';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
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
            setError('Invalid credentials. Please verify your username and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-hero" style={{ backgroundImage: `linear-gradient(rgba(26, 44, 66, 0.6), rgba(26, 44, 66, 0.4)), url('/assets/hero.png')` }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <ShieldCheck size={48} color="#1abc9c" />
                        <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: '800' }}>RMS Portal</h1>
                    </div>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '500px', lineHeight: '1.8' }}>
                        Welcome to the official Residential Management System. Secure, reliable, and integrated community management at your fingertips.
                    </p>
                    
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-card-flat">
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <Building2 size={28} color="#fff" />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 8px 0' }}>
                            Account Sign In
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Access your community dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="status-badge status-REJECTED" style={{
                            width: '100%',
                            marginBottom: '24px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            justifyContent: 'center'
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ paddingLeft: '44px' }}
                                    disabled={isLoading}
                                />
                                <User size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '44px' }}
                                    disabled={isLoading}
                                />
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            style={{ width: '100%', marginTop: '8px', height: '52px' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (
                                <>
                                    <LogIn size={20} />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Institutional Grade Security & Compliance
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
