import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ResidentDashboard = () => {
    const [activeTab, setActiveTab] = useState('notices');
    const [notices, setNotices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [vacationRequests, setVacationRequests] = useState([]);
    
    // Complaint Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Vacation Form
    const [vacateDate, setVacateDate] = useState('');
    const [vacationReason, setVacationReason] = useState('');
    const [vacationMessage, setVacationMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('residentId')) {
            navigate('/login');
            return;
        }

        if (activeTab === 'notices') {
            fetchNotices();
        } else if (activeTab === 'complaints') {
            fetchComplaints();
        } else if (activeTab === 'vacate') {
            fetchVacationRequests();
        }
    }, [activeTab, navigate]);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/resident/notices');
            setNotices(res.data);
        } catch (error) {
            console.error('Failed to fetch notices', error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/resident/complaints');
            setComplaints(res.data);
        } catch (error) {
            console.error('Failed to fetch complaints', error);
        }
    };

    const fetchVacationRequests = async () => {
        try {
            const res = await api.get('/resident/vacate');
            setVacationRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch vacation requests', error);
        }
    };

    const handleRaiseComplaint = async (e) => {
        e.preventDefault();
        try {
            await api.post('/resident/complaints', { title, description });
            setMessage('Complaint raised successfully!');
            setTitle('');
            setDescription('');
            fetchComplaints();
        } catch (error) {
            setMessage('Failed to raise complaint.');
        }
    };

    const handleVacationRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/resident/vacate', { 
                vacateDate,
                reason: vacationReason 
            });
            setVacationMessage('Vacation notice submitted successfully!');
            setVacateDate('');
            setVacationReason('');
            fetchVacationRequests();
        } catch (error) {
            setVacationMessage(error.response?.data?.message || 'Failed to submit vacation notice.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('residentId');
        navigate('/login');
    };

    // Calculate min date (2 months from now)
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() + 2);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <div className="app-container">
            <div className="header">
                <h2>Resident Dashboard</h2>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div className="tabs">
                <div 
                    className={`tab ${activeTab === 'notices' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notices')}
                >
                    Notices
                </div>
                <div 
                    className={`tab ${activeTab === 'complaints' ? 'active' : ''}`}
                    onClick={() => setActiveTab('complaints')}
                >
                    Complaints
                </div>
                <div 
                    className={`tab ${activeTab === 'vacate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vacate')}
                >
                    Vacate
                </div>
            </div>

            <div className="card">
                {activeTab === 'notices' && (
                    <div>
                        <div className="section-header">
                            <h3>Recent Notices</h3>
                        </div>
                        {notices.length === 0 ? <p>No notices available.</p> : (
                            notices.map(notice => (
                                <div key={notice.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                    <h4>{notice.title}</h4>
                                    <p style={{ color: '#666', fontSize: '12px' }}>{new Date(notice.date).toLocaleString()}</p>
                                    <p>{notice.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <div>
                        <h3>Raise a Complaint</h3>
                        {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
                        <form onSubmit={handleRaiseComplaint} style={{ marginBottom: '30px' }}>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    rows="4" 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    required 
                                ></textarea>
                            </div>
                            <button type="submit" className="btn">Submit Complaint</button>
                        </form>

                        <h3>My Complaints</h3>
                        {complaints.length === 0 ? <p>No complaints raised yet.</p> : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map(comp => (
                                        <tr key={comp.id}>
                                            <td>{comp.id}</td>
                                            <td>{comp.title}</td>
                                            <td>{new Date(comp.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge status-${comp.status}`}>
                                                    {comp.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'vacate' && (
                    <div>
                        <h3>Notify Management of Vacation</h3>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                            Note: You must provide at least 2 months notice before vacating.
                        </p>
                        {vacationMessage && <div style={{ color: vacationMessage.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{vacationMessage}</div>}
                        <form onSubmit={handleVacationRequest} style={{ marginBottom: '30px' }}>
                            <div className="form-group">
                                <label>Intended Vacate Date</label>
                                <input 
                                    type="date" 
                                    value={vacateDate} 
                                    min={minDateStr}
                                    onChange={e => setVacateDate(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason/Message</label>
                                <textarea 
                                    rows="3" 
                                    value={vacationReason} 
                                    onChange={e => setVacationReason(e.target.value)} 
                                    placeholder="Optional: Why are you vacating?"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn">Notify Management</button>
                        </form>

                        <h3>My Vacation Requests</h3>
                        {vacationRequests.length === 0 ? <p>No requests submitted.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Vacate Date</th>
                                            <th>Message</th>
                                            <th>Submitted On</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vacationRequests.map(req => (
                                            <tr key={req.id}>
                                                <td><strong>{req.vacateDate}</strong></td>
                                                <td>{req.reason || '-'}</td>
                                                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge status-${req.status}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResidentDashboard;
