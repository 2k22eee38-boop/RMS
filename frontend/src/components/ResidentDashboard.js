import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ResidentDashboard.css';
import {
    Bell,
    MessageSquare,
    Calendar,
    LogOut,
    Send,
    CheckCircle2,
    Building2,
    Dumbbell,
    Waves,
    Tv,
    Gamepad2,
    Music,
    Library
} from 'lucide-react';
import api from '../api/api';

const ResidentDashboard = () => {
    const [activeTab, setActiveTab] = useState('notices');
    const [notices, setNotices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [vacationRequests, setVacationRequests] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    // Complaint Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Vacation Form
    const [vacateDate, setVacateDate] = useState('');
    const [vacationReason, setVacationReason] = useState('');
    const [vacationMessage, setVacationMessage] = useState('');

    // Booking Form
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('11:00');
    const [isFullDay, setIsFullDay] = useState(false);
    const [bookingMessage, setBookingMessage] = useState('');

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
        } else if (activeTab === 'amenities') {
            fetchFacilities();
            fetchMyAmenityBookings();
        }
    }, [activeTab, navigate]);

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/resident/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        }
    };

    const fetchMyAmenityBookings = async () => {
        try {
            const res = await api.get('/resident/my-bookings');
            setMyBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch my bookings', error);
        }
    };

    const handleBookAmenity = async (e) => {
        e.preventDefault();
        try {
            await api.post('/resident/book-amenity', {
                amenity: selectedAmenity.name,
                bookingDate,
                startTime: isFullDay ? null : startTime,
                endTime: isFullDay ? null : endTime,
                isFullDay
            });
            setBookingMessage('Booking request sent successfully!');
            setBookingDate('');
            setSelectedAmenity(null);
            fetchMyAmenityBookings();
        } catch (error) {
            setBookingMessage(error.response?.data?.message || 'Failed to request booking.');
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await api.get('/resident/notices');
            setNotices(res.data);
        } catch (error) {
            console.error('Failed to fetch notices', error);
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
            <Navbar
                title="Resident Portal"
                onLogout={handleLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={[
                    { id: 'notices', label: <><Bell size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Notices</> },
                    { id: 'amenities', label: <><Dumbbell size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Amenities</> },
                    { id: 'complaints', label: <><MessageSquare size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Complaints</> },
                    { id: 'vacate', label: <><Calendar size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Vacate</> }
                ]}
            />

            <div style={{
                height: '260px',
                background: `linear-gradient(rgba(26, 44, 66, 0.75), rgba(26, 44, 66, 0.4)), url('/assets/lobby.png')`,
                backgroundSize: 'cover',
                boxShadow: '0 8px 32px rgba(26, 44, 66, 0.15)',
                backgroundPosition: 'center',
                borderRadius: '16px',
                marginTop: '32px',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                padding: '40px',
                color: '#fff'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>Good Day</h1>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>Welcome to your luxury community portal</p>
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

                {activeTab === 'amenities' && (
                    <div>
                        <div className="section-header">
                            <h3>Community Amenities</h3>
                            <p className="text-muted">Book facilities for your private use</p>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            {facilities.map(facility => (
                                <div key={facility.id} className="card" style={{ marginBottom: 0, padding: '24px', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ 
                                            background: 'var(--secondary)', 
                                            color: 'var(--primary)', 
                                            width: '48px', 
                                            height: '48px', 
                                            borderRadius: '12px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center' 
                                        }}>
                                            {getAmenityIcon(facility.name)}
                                        </div>
                                        <span className={`status-badge ${facility.closed ? 'status-REJECTED' : 'status-ACCEPTED'}`}>
                                            {facility.closed ? 'Maintenance' : 'Available'}
                                        </span>
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0' }}>{formatAmenityName(facility.name)}</h4>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <strong>Supervisor:</strong> {facility.supervisorName || 'Unassigned'}<br />
                                        <strong>Contact:</strong> {facility.supervisorPhone || 'N/A'}
                                    </div>
                                    {facility.closed && facility.closureReason && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '8px' }}>
                                            Reason: {facility.closureReason}
                                        </p>
                                    )}
                                    <button 
                                        className="btn" 
                                        disabled={facility.closed} 
                                        style={{ width: '100%', marginTop: '20px' }}
                                        onClick={() => {
                                            setSelectedAmenity(facility);
                                            setBookingMessage('');
                                        }}
                                    >
                                        Book Facility
                                    </button>
                                </div>
                            ))}
                        </div>

                        <h3>My Bookings</h3>
                        {myBookings.length === 0 ? <p>No bookings found.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Facility</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myBookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {getAmenityIcon(booking.amenity)}
                                                        <strong>{formatAmenityName(booking.amenity)}</strong>
                                                    </div>
                                                </td>
                                                <td>{booking.bookingDate}</td>
                                                <td>
                                                    {booking.isFullDay ? 'Full Day' : `${booking.startTime} - ${booking.endTime}`}
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${booking.status}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedAmenity && (
                            <div className="modal-overlay">
                                <div className="modal-content" style={{ maxWidth: '500px' }}>
                                    <div className="modal-header">
                                        <h3>Book {formatAmenityName(selectedAmenity.name)}</h3>
                                        <button className="close-btn" onClick={() => setSelectedAmenity(null)}>&times;</button>
                                    </div>
                                    <form onSubmit={handleBookAmenity}>
                                        {bookingMessage && <div style={{ color: bookingMessage.includes('success') ? 'green' : 'red', marginBottom: '15px' }}>{bookingMessage}</div>}
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                                        </div>
                                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input type="checkbox" id="isFullDay" checked={isFullDay} onChange={e => setIsFullDay(e.target.checked)} style={{ width: 'auto' }} />
                                            <label htmlFor="isFullDay" style={{ margin: 0 }}>Full Day Booking</label>
                                        </div>
                                        {!isFullDay && (
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Start Time</label>
                                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>End Time</label>
                                                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-actions">
                                            <button type="submit" className="btn" style={{ flex: 1 }}>Confirm Booking</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setSelectedAmenity(null)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
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
