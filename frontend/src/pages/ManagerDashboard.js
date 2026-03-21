import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ManagerDashboard.css';
import {
    Users,
    Bell,
    MessageSquare,
    Calendar,
    Trash2,
    Check,
    X,
    Mail,
    Phone,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Briefcase,
    Coffee
} from 'lucide-react';
import api from '../api/api';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('residents');

    // Residents Data
    const [residents, setResidents] = useState([]);
    const [resPassword, setResPassword] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [familyLeader, setFamilyLeader] = useState('');
    const [memberCount, setMemberCount] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    //const [resMessage, setResMessage] = useState('');
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

    // Employees Data
    const [employees, setEmployees] = useState([]);
    const [empName, setEmpName] = useState('');
    const [empCategory, setEmpCategory] = useState('SECURITY');
    const [empPhone, setEmpPhone] = useState('');
    const [empShift, setEmpShift] = useState('DAY');
    const [showEmpModal, setShowEmpModal] = useState(false);

    // Amenities Data
    const [amenityBookings, setAmenityBookings] = useState([]);
    const [facilities, setFacilities] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'residents') fetchResidents();
        else if (activeTab === 'notices') fetchNotices();
        else if (activeTab === 'complaints') fetchComplaints();
        else if (activeTab === 'vacation-requests') fetchVacationRequests();
        else if (activeTab === 'employees') fetchEmployees();
        else if (activeTab === 'amenities') {
            fetchAmenityBookings();
            fetchFacilities();
        }
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

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/manager/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAmenityBookings = async () => {
        try {
            const res = await api.get('/manager/amenities');
            setAmenityBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/manager/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddResident = async (e) => {
        e.preventDefault();
        try {
            await api.post('/manager/residents', {
                username: email,
                password: resPassword,
                flatNo,
                familyLeader,
                memberCount: parseInt(memberCount),
                phone,
                email
            });
            alert('Resident added successfully!');
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
        if (window.confirm('Are you sure you want to delete this resident account? This action cannot be undone.')) {
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
        if (window.confirm('Delete this notice?')) {
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

    const handleUpdateAmenityStatus = async (id, status) => {
        try {
            await api.put(`/manager/amenities/${id}/status`, { status });
            fetchAmenityBookings();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateFacility = async (id, e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            supervisorName: form.supervisorName.value,
            supervisorPhone: form.supervisorPhone.value,
            closed: form.isClosed.checked,
            closedFrom: form.closedFrom.value || null,
            closedUntil: form.closedUntil.value || null,
            closureReason: form.closureReason.value
        };
        try {
            await api.put(`/manager/facilities/${id}`, data);
            alert('Facility updated successfully!');
            fetchFacilities();
        } catch (error) {
            alert('Failed to update facility.');
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/manager/employees', {
                name: empName,
                category: empCategory,
                phone: empPhone,
                shift: empShift
            });
            alert('Employee added successfully!');
            setEmpName('');
            setEmpCategory('SECURITY');
            setEmpPhone('');
            setEmpShift('DAY');
            setShowEmpModal(false);
            fetchEmployees();
        } catch (error) {
            alert('Failed to add employee.');
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/manager/employees/${id}`);
                alert('Employee deleted successfully!');
                fetchEmployees();
            } catch (error) {
                alert('Failed to delete employee.');
            }
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)' }}>
            <Navbar 
                title="Property Management"
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'residents', label: 'Residents', icon: <Users size={18} /> },
                    { id: 'employees', label: 'Staff', icon: <Briefcase size={18} /> },
                    { id: 'amenities', label: 'Amenities', icon: <Coffee size={18} /> },
                    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
                    { id: 'complaints', label: 'Complaints', icon: <MessageSquare size={18} /> },
                    { id: 'vacation-requests', label: 'Vacation', icon: <Calendar size={18} /> }
                ]}
                onLogout={handleLogout}
            />
            <div className="app-container" style={{ paddingTop: '32px' }}>
            <div style={{
                background: `linear-gradient(rgba(26, 44, 66, 0.85), rgba(26, 44, 66, 0.7)), url('/assets/manager_bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '32px 40px',
                borderRadius: '16px',
                marginBottom: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(26, 44, 66, 0.15)'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Management Console</h3>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Welcome back, Community Manager</p>
                </div>
                <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                    <strong>Facility Status:</strong> <span style={{ color: 'var(--accent)' }}>Active</span>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '48px'
            }}>
                <div className="card" style={{ marginBottom: 0, padding: '24px', borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: 'var(--accent)' }}>
                            <Users size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Occupancy</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{residents.length} <span style={{ fontSize: '1rem', fontWeight: '500' }}>Units</span></div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: 0, padding: '24px', borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: 'var(--danger)' }}>
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Unsolved Issues</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {complaints.filter(c => c.status === 'PENDING').length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: 0, padding: '24px', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: 'var(--warning)' }}>
                            <Clock size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Vacate Notices</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {vacationRequests.filter(v => v.status === 'PENDING').length}
                            </div>
                        </div>
                    </div>
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
                                            <th>Contact</th>
                                            <th>Username (Email)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {residents.map(r => (
                                            <tr key={r.id}>
                                                <td><span style={{ fontWeight: '700', color: 'var(--primary)' }}>{r.flatNo || 'N/A'}</span></td>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{r.familyLeader || 'N/A'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.memberCount || 0} Members</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                        <Phone size={14} className="text-muted" /> {r.phone || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                        <Mail size={14} className="text-muted" /> {r.email || r.username}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-icon btn-danger"
                                                        title="Delete Resident"
                                                        onClick={() => handleDeleteResident(r.id)}
                                                    >
                                                        <Trash2 size={18} />
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
                                                <label>Flat Number</label>
                                                <input type="text" placeholder="e.g. A-101" value={flatNo} onChange={e => setFlatNo(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Family Leader Name</label>
                                                <input type="text" placeholder="Full Name" value={familyLeader} onChange={e => setFamilyLeader(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Number of Members</label>
                                                <input type="number" value={memberCount} onChange={e => setMemberCount(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input type="tel" placeholder="+91 ..." value={phone} onChange={e => setPhone(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address / Username</label>
                                            <input type="email" placeholder="resident@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-divider" style={{ borderTop: '1px solid var(--border)', margin: '24px 0' }}></div>
                                        <div className="form-group">
                                            <label>Login Password</label>
                                            <input type="password" value={resPassword} onChange={e => setResPassword(e.target.value)} required />
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
                                            <Trash2 size={18} />
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
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="btn-icon"
                                                            style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}
                                                            onClick={() => handleUpdateVacationStatus(req.id, 'ACCEPTED')}
                                                            title="Accept"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className="btn-icon btn-danger"
                                                            onClick={() => handleUpdateVacationStatus(req.id, 'REJECTED')}
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                                {req.status !== 'PENDING' && (
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <CheckCircle2 size={14} /> Processed
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                
                {activeTab === 'employees' && (
                    <div>
                        <div className="section-header">
                            <h3>Staff Directory</h3>
                            <button className="btn" onClick={() => setShowEmpModal(true)}>+ Add Staff</button>
                        </div>
                        
                        {employees.length === 0 ? <p>No staff found.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Contact</th>
                                            <th>Shift</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map(e => (
                                            <tr key={e.id}>
                                                <td><span style={{ fontWeight: '600', color: 'var(--primary)' }}>{e.name}</span></td>
                                                <td>
                                                    <span className={`status-badge status-${e.category || 'OTHER'}`} style={{background: 'rgba(52, 152, 219, 0.1)', color: '#3498db'}}>
                                                        {e.category}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                        <Phone size={14} className="text-muted" /> {e.phone}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: '500', color: e.shift === 'DAY' ? '#f39c12' : '#8e44ad' }}>
                                                        {e.shift} Shift
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-icon btn-danger"
                                                        title="Delete Staff"
                                                        onClick={() => handleDeleteEmployee(e.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showEmpModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3 style={{ margin: 0 }}>Add New Staff Member</h3>
                                        <button className="close-btn" onClick={() => setShowEmpModal(false)}>&times;</button>
                                    </div>
                                    <form onSubmit={handleAddEmployee}>
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" value={empName} onChange={e => setEmpName(e.target.value)} required />
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select value={empCategory} onChange={e => setEmpCategory(e.target.value)}>
                                                    <option value="SECURITY">Security</option>
                                                    <option value="SWEEPER">Sweeper</option>
                                                    <option value="PLUMBER">Plumber</option>
                                                    <option value="ELECTRICIAN">Electrician</option>
                                                    <option value="GARDENER">Gardener</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input type="tel" value={empPhone} onChange={e => setEmpPhone(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Shift</label>
                                            <select value={empShift} onChange={e => setEmpShift(e.target.value)}>
                                                <option value="DAY">Day Shift</option>
                                                <option value="NIGHT">Night Shift</option>
                                            </select>
                                        </div>
                                        <div className="form-actions" style={{ marginTop: '24px' }}>
                                            <button type="submit" className="btn" style={{ flex: 1 }}>Save Staff Member</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowEmpModal(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'amenities' && (
                    <div>
                        <div className="section-header">
                            <h3>Facility Management</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            {facilities.map(facility => (
                                <div key={facility.id} className="card" style={{ marginBottom: 0, padding: '24px', borderTop: `4px solid ${facility.closed ? '#ef4444' : '#10b981'}` }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700' }}>{facility.name.replace('_', ' ')}</h4>
                                    <form onSubmit={(e) => handleUpdateFacility(facility.id, e)}>
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Supervisor Name</label>
                                            <input type="text" name="supervisorName" defaultValue={facility.supervisorName || ''} placeholder="e.g. John Doe" style={{ padding: '8px', fontSize: '0.9rem' }} />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Supervisor Phone</label>
                                            <input type="tel" name="supervisorPhone" defaultValue={facility.supervisorPhone || ''} placeholder="+91..." style={{ padding: '8px', fontSize: '0.9rem' }} />
                                        </div>
                                        <div style={{ background: facility.closed ? '#fef2f2' : '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: facility.closed ? '12px' : 0 }}>
                                                <input type="checkbox" name="isClosed" defaultChecked={facility.closed} onChange={(e) => {
                                                    const parent = e.target.closest('form');
                                                    parent.querySelector('.closure-details').style.display = e.target.checked ? 'block' : 'none';
                                                    if(e.target.checked) parent.closest('.card').style.borderTopColor = '#ef4444';
                                                    else parent.closest('.card').style.borderTopColor = '#10b981';
                                                }} />
                                                <span style={{ fontWeight: '600', color: facility.closed ? '#ef4444' : 'inherit' }}>Temporarily Close Facility</span>
                                            </label>
                                            <div className="closure-details" style={{ display: facility.closed ? 'block' : 'none' }}>
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>From</label>
                                                        <input type="date" name="closedFrom" defaultValue={facility.closedFrom || ''} style={{ padding: '6px', fontSize: '0.85rem' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Until</label>
                                                        <input type="date" name="closedUntil" defaultValue={facility.closedUntil || ''} style={{ padding: '6px', fontSize: '0.85rem' }} />
                                                    </div>
                                                </div>
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <input type="text" name="closureReason" defaultValue={facility.closureReason || ''} placeholder="Reason (e.g. Renovation)" style={{ padding: '8px', fontSize: '0.85rem' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn" style={{ width: '100%', padding: '8px' }}>Save Layout</button>
                                    </form>
                                </div>
                            ))}
                        </div>

                        <div className="section-header">
                            <h3>Amenity Bookings</h3>
                        </div>
                        
                        {amenityBookings.length === 0 ? <p>No amenity bookings found.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Resident</th>
                                            <th>Amenity</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {amenityBookings.map(b => (
                                            <tr key={b.id}>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{b.resident?.familyLeader}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flat: {b.resident?.flatNo}</div>
                                                </td>
                                                <td><span style={{ fontWeight: '600', color: 'var(--primary)' }}>{b.amenity.replace('_', ' ')}</span></td>
                                                <td>{b.bookingDate}</td>
                                                <td>{b.isFullDay ? 'All Day' : `${b.startTime} - ${b.endTime}`}</td>
                                                <td>
                                                    <span className={`status-badge status-${b.status}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {b.status === 'PENDING' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                className="btn-icon"
                                                                style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}
                                                                onClick={() => handleUpdateAmenityStatus(b.id, 'APPROVED')}
                                                                title="Approve"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                className="btn-icon btn-danger"
                                                                onClick={() => handleUpdateAmenityStatus(b.id, 'REJECTED')}
                                                                title="Reject"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {b.status !== 'PENDING' && (
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <CheckCircle2 size={14} /> Processed
                                                        </div>
                                                    )}
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
        </div>
    );
};

export default ManagerDashboard;
