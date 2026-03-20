import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ManagerDashboard.css';
import {
    Users,
    Bell,
    MessageSquare,
    Calendar,
    LogOut,
    Plus,
    Trash2,
    Check,
    X,
    Mail,
    Phone,
    Home,
    AlertTriangle,
    CheckCircle2,
    Building2,
    Clock,
    Dumbbell,
    Waves,
    Tv,
    Gamepad2,
    Music,
    Library
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

    // Vacation Data
    const [vacationRequests, setVacationRequests] = useState([]);

    // Amenities Data
    const [facilities, setFacilities] = useState([]);
    const [allBookings, setAllBookings] = useState([]);

    // Facility Edit Form
    const [editingFacility, setEditingFacility] = useState(null);
    const [supervisorName, setSupervisorName] = useState('');
    const [supervisorPhone, setSupervisorPhone] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const [closedFrom, setClosedFrom] = useState('');
    const [closedUntil, setClosedUntil] = useState('');
    const [closureReason, setClosureReason] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('managerId')) {
            navigate('/login');
            return;
        }

        if (activeTab === 'residents') {
            fetchResidents();
        } else if (activeTab === 'notices') {
            fetchNotices();
        } else if (activeTab === 'complaints') {
            fetchComplaints();
        } else if (activeTab === 'vacation-requests') {
            fetchVacationRequests();
        } else if (activeTab === 'amenities') {
            fetchFacilities();
            fetchAllBookings();
        }
    }, [activeTab, navigate]);

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/manager/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        }
    };

    const fetchAllBookings = async () => {
        try {
            const res = await api.get('/manager/amenity-bookings');
            setAllBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const handleUpdateFacility = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/manager/facilities/${editingFacility.id}`, {
                supervisorName,
                supervisorPhone,
                closed: isClosed,
                closedFrom: isClosed ? closedFrom : null,
                closedUntil: isClosed ? closedUntil : null,
                closureReason: isClosed ? closureReason : ""
            });
            setEditingFacility(null);
            fetchFacilities();
        } catch (error) {
            console.error('Failed to update facility', error);
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            await api.put(`/manager/amenity-bookings/${bookingId}/status`, null, {
                params: { status }
            });
            fetchAllBookings();
        } catch (error) {
            console.error('Failed to update booking status', error);
        }
    };

    const getAmenityIcon = (name) => {
        switch (name) {
            case 'SWIMMING_POOL': return <Waves size={24} />;
            case 'GYM': return <Dumbbell size={24} />;
            case 'THEATRE': return <Tv size={24} />;
            case 'GAME_COURT': return <Gamepad2 size={24} />;
            case 'PARTY_HALL': return <Music size={24} />;
            default: return <Library size={24} />;
        }
    };

    const formatAmenityName = (name) => {
        return name.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

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

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="app-container">
            <Navbar
                title="Property Management"
                onLogout={handleLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={[
                    { id: 'residents', label: 'Residents' },
                    { id: 'notices', label: 'Notices' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'complaints', label: 'Complaints' },
                    { id: 'vacation-requests', label: 'Vacation' }
                ]}
            />

            <div style={{
                background: `linear-gradient(rgba(26, 44, 66, 0.85), rgba(26, 44, 66, 0.7)), url('/assets/manager_bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '32px 40px',
                borderRadius: '16px',
                marginTop: '32px',
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

                {activeTab === 'amenities' && (
                    <div style={{ padding: '20px' }}>
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>Amenity Management</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Manage property facilities and oversee resident bookings</p>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--secondary)', paddingBottom: '12px' }}>Property Facilities</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Facility</th>
                                            <th>Supervisor</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilities.map(facility => (
                                            <tr key={facility.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ color: 'var(--primary)' }}>{getAmenityIcon(facility.name)}</div>
                                                        <strong>{formatAmenityName(facility.name)}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{facility.supervisorName || 'Not Set'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{facility.supervisorPhone || ''}</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${facility.closed ? 'status-REJECTED' : 'status-ACCEPTED'}`}>
                                                        {facility.closed ? 'Closed' : 'Active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-secondary" style={{ padding: '6px 15px', fontSize: '13px' }} onClick={() => {
                                                        setEditingFacility(facility);
                                                        setSupervisorName(facility.supervisorName || '');
                                                        setSupervisorPhone(facility.supervisorPhone || '');
                                                        setIsClosed(facility.closed);
                                                        setClosedFrom(facility.closedFrom || '');
                                                        setClosedUntil(facility.closedUntil || '');
                                                        setClosureReason(facility.closureReason || '');
                                                    }}>
                                                        Edit Facility
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--secondary)', paddingBottom: '12px' }}>Resident Booking Requests</h3>
                            {allBookings.length === 0 ? <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No bookings requested yet.</p> : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Resident</th>
                                                <th>Facility</th>
                                                <th>Booking Details</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allBookings.map(booking => (
                                                <tr key={booking.id}>
                                                    <td>
                                                        <div style={{ fontWeight: '700' }}>{booking.resident?.familyLeader}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flat {booking.resident?.flatNo}</div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {getAmenityIcon(booking.amenity)}
                                                            {formatAmenityName(booking.amenity)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: '500' }}>{booking.bookingDate}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                            {booking.isFullDay ? 'Full Day' : `${booking.startTime} - ${booking.endTime}`}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${booking.status}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {booking.status === 'PENDING' && (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button 
                                                                    className="btn" 
                                                                    style={{ padding: '8px', background: 'var(--accent)', minWidth: '40px' }}
                                                                    onClick={() => handleBookingAction(booking.id, 'APPROVED')}
                                                                >
                                                                    <Check size={18} />
                                                                </button>
                                                                <button 
                                                                    className="btn btn-secondary" 
                                                                    style={{ padding: '8px', borderColor: 'var(--danger)', color: 'var(--danger)', minWidth: '40px' }}
                                                                    onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                                                                >
                                                                    <X size={18} />
                                                                </button>
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

                        {editingFacility && (
                            <div className="modal-overlay">
                                <div className="modal-content" style={{ maxWidth: '600px' }}>
                                    <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                                        <h3 style={{ margin: 0, color: 'var(--primary)' }}>Manage {formatAmenityName(editingFacility.name)}</h3>
                                        <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingFacility(null)}>&times;</button>
                                    </div>
                                    <form onSubmit={handleUpdateFacility}>
                                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                            <div className="form-group">
                                                <label>Supervisor Name</label>
                                                <input type="text" value={supervisorName} onChange={e => setSupervisorName(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Supervisor Phone</label>
                                                <input type="text" value={supervisorPhone} onChange={e => setSupervisorPhone(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                            <input type="checkbox" id="facilityClosed" checked={isClosed} onChange={e => setIsClosed(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                            <label htmlFor="facilityClosed" style={{ margin: 0, cursor: 'pointer', fontWeight: '600' }}>Mark Facility as Temporarily Closed</label>
                                        </div>

                                        {isClosed && (
                                            <div style={{ background: 'rgba(231, 76, 60, 0.05)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(231, 76, 60, 0.1)', marginBottom: '20px' }}>
                                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                                                    <div className="form-group">
                                                        <label style={{ color: 'var(--danger)' }}>Closed From</label>
                                                        <input type="date" value={closedFrom} onChange={e => setClosedFrom(e.target.value)} required={isClosed} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ color: 'var(--danger)' }}>Closed Until</label>
                                                        <input type="date" value={closedUntil} onChange={e => setClosedUntil(e.target.value)} required={isClosed} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ color: 'var(--danger)' }}>Closure Reason</label>
                                                    <textarea value={closureReason} onChange={e => setClosureReason(e.target.value)} placeholder="e.g., Annual maintenance, renovation..." required={isClosed} rows="3" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                                            <button type="submit" className="btn" style={{ flex: 1, height: '45px', background: 'var(--accent)' }}>Save Changes</button>
                                            <button type="button" className="btn btn-secondary" style={{ flex: 1, height: '45px' }} onClick={() => setEditingFacility(null)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
