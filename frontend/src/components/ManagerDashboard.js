import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('residents');

    // Residents Data
    const [residents, setResidents] = useState([]);
    const [resUsername, setResUsername] = useState('');
    const [resPassword, setResPassword] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [familyLeader, setFamilyLeader] = useState('');
    const [memberCount, setMemberCount] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Notices Data
    const [notices, setNotices] = useState([]);
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');

    // Complaints Data
    const [complaints, setComplaints] = useState([]);

    // Vacation Data
    const [vacationRequests, setVacationRequests] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'residents') fetchResidents();
        else if (activeTab === 'notices') fetchNotices();
        else if (activeTab === 'complaints') fetchComplaints();
        else if (activeTab === 'vacation-requests') fetchVacationRequests();
    }, [activeTab]);

    const fetchResidents = async () => {
        try {
            const res = await api.get('/manager/residents');
            setResidents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await api.get('/resident/notices'); // anyone can read notices
            setNotices(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/manager/complaints');
            setComplaints(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVacationRequests = async () => {
        try {
            const res = await api.get('/manager/vacate');
            setVacationRequests(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddResident = async (e) => {
        e.preventDefault();
        try {
            await api.post('/manager/residents', {
                username: resUsername,
                password: resPassword,
                flatNo,
                familyLeader,
                memberCount: Number.parseInt(memberCount),
                phone,
                email
            });
            alert('Resident added successfully!');
            setResUsername('');
            setResPassword('');
            setFlatNo('');
            setFamilyLeader('');
            setMemberCount('');
            setPhone('');
            setEmail('');
            setShowModal(false);
            fetchResidents();
        } catch (error) {
            alert('Failed to add resident.');
        }
    };

    const handleDeleteResident = async (id) => {
        if (globalThis.confirm('Are you sure you want to delete this resident account? This action cannot be undone.')) {
            try {
                await api.delete(`/manager/residents/${id}`);
                alert('Resident deleted successfully!');
                fetchResidents();
            } catch (error) {
                alert('Failed to delete resident.');
            }
        }
    };

    const handleAddNotice = async (e) => {
        e.preventDefault();
        try {
            await api.post('/manager/notices', { title: noticeTitle, content: noticeContent });
            setNoticeMessage('Notice created successfully!');
            setNoticeTitle('');
            setNoticeContent('');
            fetchNotices();
        } catch (error) {
            setNoticeMessage('Failed to create notice.');
        }
    };

    const handleDeleteNotice = async (id) => {
        if (globalThis.confirm('Delete this notice?')) {
            try {
                await api.delete(`/manager/notices/${id}`);
                fetchNotices();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdateComplaintStatus = async (id, status) => {
        try {
            await api.put(`/manager/complaints/${id}/status`, { status });
            fetchComplaints();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateVacationStatus = async (id, status) => {
        try {
            await api.put(`/manager/vacate/${id}/status`, { status });
            fetchVacationRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="app-container">
            <div className="header">
                <h2>Manager Dashboard</h2>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div className="tabs">
                <div className={`tab ${activeTab === 'residents' ? 'active' : ''}`} onClick={() => setActiveTab('residents')}>
                    Residents
                </div>
                <div className={`tab ${activeTab === 'notices' ? 'active' : ''}`} onClick={() => setActiveTab('notices')}>
                    Notices
                </div>
                <div className={`tab ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
                    Complaints
                </div>
                <div className={`tab ${activeTab === 'vacation-requests' ? 'active' : ''}`} onClick={() => setActiveTab('vacation-requests')}>
                    Vacation Requests
                </div>
            </div>

            <div className="card">
                {activeTab === 'residents' && (
                    <div>
                        <div className="section-header">
                            <h3>Registered Residents</h3>
                            <button className="btn" onClick={() => setShowModal(true)}>+ Add Resident</button>
                        </div>

                        {residents.length === 0 ? <p>No residents found.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Flat No</th>
                                            <th>Family Leader</th>
                                            <th>Members</th>
                                            <th>Contact</th>
                                            <th>Email</th>
                                            <th>Username</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {residents.map(r => (
                                            <tr key={r.id}>
                                                <td><strong>{r.flatNo || 'N/A'}</strong></td>
                                                <td>{r.familyLeader || 'N/A'}</td>
                                                <td>{r.memberCount || 0}</td>
                                                <td>{r.phone || 'N/A'}</td>
                                                <td>{r.email || 'N/A'}</td>
                                                <td>{r.username}</td>
                                                <td>
                                                    <button
                                                        className="btn-icon btn-danger"
                                                        title="Delete Resident"
                                                        onClick={() => handleDeleteResident(r.id)}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3 style={{ margin: 0 }}>Add New Resident</h3>
                                        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                                    </div>
                                    <form onSubmit={handleAddResident}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Flat Number
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. A-101"
                                                        value={flatNo}
                                                        onChange={e => setFlatNo(e.target.value)}
                                                        required />
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Family Leader Name
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={familyLeader}
                                                        onChange={e => setFamilyLeader(e.target.value)}
                                                        required />
                                                </label>

                                            </div>
                                            <div className="form-group">
                                                <label>Number of Members
                                                    <input
                                                        type="number"
                                                        value={memberCount}
                                                        onChange={e => setMemberCount(e.target.value)}
                                                        required />
                                                </label>

                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number
                                                    <input
                                                        type="tel"
                                                        placeholder="+91 ..."
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        required />
                                                </label>

                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address
                                                <input 
                                                type="email" 
                                                placeholder="resident@example.com" 
                                                value={email} 
                                                onChange={e => setEmail(e.target.value)} 
                                                required />
                                            </label>

                                        </div>
                                        <div className="form-divider"></div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Login Username
                                                    <input 
                                                    type="text" 
                                                    value={resUsername} onChange={e => setResUsername(e.target.value)} required />
                                                </label>

                                            </div>
                                            <div className="form-group">
                                                <label>Login Password
                                                    <input 
                                                    type="password" 
                                                    value={resPassword} 
                                                    onChange={e => setResPassword(e.target.value)} 
                                                    required />
                                                </label>

                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn" style={{ flex: 1 }}>Submit Registration</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div>
                        <h3>Publish Notice</h3>
                        {noticeMessage && <div style={{ color: noticeMessage.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{noticeMessage}</div>}
                        <form onSubmit={handleAddNotice} style={{ marginBottom: '30px' }}>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea rows="4" value={noticeContent} onChange={e => setNoticeContent(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className="btn">Publish</button>
                        </form>

                        <h3>Existing Notices</h3>
                        {notices.length === 0 ? <p>No notices available.</p> : (
                            notices.map(notice => (
                                <div key={notice.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4>{notice.title}</h4>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 12px 0' }}>{new Date(notice.date).toLocaleString()}</p>
                                        </div>
                                        <button
                                            className="btn-icon btn-danger"
                                            title="Delete Notice"
                                            onClick={() => handleDeleteNotice(notice.id)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <p>{notice.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <div>
                        <h3>Resident Complaints</h3>
                        {complaints.length === 0 ? <p>No complaints found.</p> : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Resident</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map(comp => (
                                        <tr key={comp.id}>
                                            <td>{comp.id}</td>
                                            <td>{comp.resident?.username}</td>
                                            <td>{comp.title}</td>
                                            <td>{comp.description}</td>
                                            <td>{new Date(comp.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge status-${comp.status}`}>
                                                    {comp.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={comp.status}
                                                    onChange={(e) => handleUpdateComplaintStatus(comp.id, e.target.value)}
                                                    style={{ padding: '5px', borderRadius: '4px' }}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="DONE">Done</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'vacation-requests' && (
                    <div>
                        <h3>Resident Vacation Notices</h3>
                        {vacationRequests.length === 0 ? <p>No requests found.</p> : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Resident</th>
                                        <th>Vacate Date</th>
                                        <th>Message</th>
                                        <th>Submitted On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vacationRequests.map(req => (
                                        <tr key={req.id}>
                                            <td>
                                                <div style={{ fontWeight: 'bold' }}>{req.resident?.familyLeader}</div>
                                                <div style={{ fontSize: '11px', color: '#666' }}>Flat: {req.resident?.flatNo}</div>
                                            </td>
                                            <td>{req.vacateDate}</td>
                                            <td style={{ maxWidth: '200px', fontSize: '13px' }}>{req.reason || <span style={{ color: '#ccc' }}>No message</span>}</td>
                                            <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge status-${req.status}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>
                                                {req.status === 'PENDING' && (
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button
                                                            className="btn btn-secondary"
                                                            style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#2ecc71' }}
                                                            onClick={() => handleUpdateVacationStatus(req.id, 'ACCEPTED')}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#e74c3c' }}
                                                            onClick={() => handleUpdateVacationStatus(req.id, 'REJECTED')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {req.status !== 'PENDING' && <span>Fully Processed</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
