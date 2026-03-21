import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ResidentDashboard.css';
import {
    Bell,
    MessageSquare,
    Calendar,
    Clock,
    Briefcase,
    Coffee,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import api from '../api/api';

const ResidentDashboard = () => {
    const [activeTab, setActiveTab] = useState('notices');
    const [notices, setNotices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [vacationRequests, setVacationRequests] = useState([]);
    
    // Employees
    const [employees, setEmployees] = useState([]);
    const [empFilter, setEmpFilter] = useState('ALL');

    // Amenities
    const [amenityBookings, setAmenityBookings] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [isFullDay, setIsFullDay] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    // Calendar Config
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const amenitiesList = [
        { id: 'SWIMMING_POOL', name: 'Swimming Pool', icon: '🏊‍♂️' },
        { id: 'THEATRE', name: 'Mini Theatre', icon: '🎬' },
        { id: 'PARTY_HALL', name: 'Party Hall', icon: '🎉' },
        { id: 'GAME_COURT', name: 'Game Court', icon: '🏸' },
        { id: 'GYM', name: 'Gymnasium', icon: '🏋️' }
    ];

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
        } else if (activeTab === 'employees') {
            fetchEmployees();
        } else if (activeTab === 'amenities') {
            fetchAmenityBookings();
            fetchFacilities();
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

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/resident/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const fetchAmenityBookings = async () => {
        try {
            const res = await api.get('/resident/amenities');
            setAmenityBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch amenity bookings', error);
        }
    };

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/resident/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        }
    };

    const handleBookAmenity = async (e) => {
        e.preventDefault();
        try {
            await api.post('/resident/amenities', {
                amenity: selectedAmenity,
                bookingDate,
                startTime: isFullDay ? null : startTime,
                endTime: isFullDay ? null : endTime,
                isFullDay
            });
            alert('Amenity booking requested successfully!');
            setShowBookingModal(false);
            setBookingDate('');
            setStartTime('');
            setEndTime('');
            setIsFullDay(false);
            fetchAmenityBookings();
        } catch (error) {
            alert(error.response?.data?.message || error.response?.data?.error || 'Failed to book amenity. Overlapping time slot or closed facility.');
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

    // Calendar Handlers
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const days = [];
        const today = new Date();
        today.setHours(0,0,0,0);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`blank-${i}`} style={{ padding: '10px' }}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const loopDate = new Date(currentYear, currentMonth, i);
            const isPast = loopDate < today;
            const isSelected = bookingDate === dateStr;

            days.push(
                <div 
                    key={i} 
                    onClick={() => { if (!isPast) setBookingDate(dateStr); }}
                    style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        background: isSelected ? '#5c2d91' : (isPast ? '#2a2a2a' : '#333'),
                        color: isPast ? '#666' : '#fff',
                        borderRadius: '4px',
                        border: isSelected ? '2px solid #fff' : '1px solid #444',
                        fontSize: '0.9rem'
                    }}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--secondary)' }}>
            <Navbar 
                title="Resident Portal"
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
                    { id: 'complaints', label: 'Complaints', icon: <MessageSquare size={18} /> },
                    { id: 'amenities', label: 'Amenities', icon: <Coffee size={18} /> },
                    { id: 'vacate', label: 'Vacate', icon: <Calendar size={18} /> },
                    { id: 'employees', label: 'Staff Directory', icon: <Briefcase size={18} /> }
                ]}
                onLogout={handleLogout}
            />
            <div className="app-container" style={{ paddingTop: '32px' }}>
            <div style={{
                height: '260px',
                background: `linear-gradient(rgba(26, 44, 66, 0.75), rgba(26, 44, 66, 0.4)), url('/assets/lobby.png')`,
                backgroundSize: 'cover',
                boxShadow: '0 8px 32px rgba(26, 44, 66, 0.15)',
                backgroundPosition: 'center',
                borderRadius: '16px',
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
                
                {activeTab === 'employees' && (
                    <div>
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Community Staff Directory</h3>
                            <select 
                                value={empFilter} 
                                onChange={(e) => setEmpFilter(e.target.value)}
                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff' }}
                            >
                                <option value="ALL">All Staff Categories</option>
                                <option value="SECURITY">Security</option>
                                <option value="SWEEPER">Sweepers</option>
                                <option value="PLUMBER">Plumbers</option>
                                <option value="ELECTRICIAN">Electricians</option>
                                <option value="GARDENER">Gardeners</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {employees.filter(emp => empFilter === 'ALL' || emp.category === empFilter).length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>No staff found for the selected category.</p>
                                </div>
                            ) : (
                                employees.filter(emp => empFilter === 'ALL' || emp.category === empFilter).map(emp => (
                                    <div key={emp.id} className="card" style={{ marginBottom: 0, padding: '24px', borderTop: `4px solid ${emp.shift === 'DAY' ? '#f59e0b' : '#8b5cf6'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700' }}>{emp.name}</h4>
                                                <span className={`status-badge status-${emp.category || 'OTHER'}`} style={{background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', fontSize: '0.75rem', fontWeight: '600'}}>
                                                    {emp.category}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', padding: '6px 10px', borderRadius: '6px', background: emp.shift === 'DAY' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: emp.shift === 'DAY' ? '#f59e0b' : '#8b5cf6' }}>
                                                {emp.shift} SHIFT
                                            </div>
                                        </div>
                                        
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: '500', fontSize: '0.95rem' }}>
                                            <span style={{background: '#fff', padding: '6px', borderRadius: '4px', display: 'flex', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            </span>
                                            {emp.phone}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'amenities' && (
                    <div>
                        <div className="section-header">
                            <h3>Book Amenities</h3>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            {amenitiesList.map(amn => {
                                const matchedFacility = facilities.find(f => f.name === amn.id);
                                const isClosed = matchedFacility?.closed;
                                return (
                                <div key={amn.id} className="card" style={{ 
                                    cursor: isClosed ? 'not-allowed' : 'pointer', 
                                    opacity: isClosed ? 0.6 : 1,
                                    textAlign: 'center', 
                                    padding: '30px', 
                                    transition: 'transform 0.2s', 
                                    borderTop: `4px solid ${isClosed ? '#ef4444' : 'var(--primary)'}` 
                                }} onClick={() => { 
                                    if(isClosed) return;
                                    setSelectedAmenity(amn.id); 
                                    setShowBookingModal(true); 
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px', filter: isClosed ? 'grayscale(100%)' : 'none' }}>{amn.icon}</div>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '12px' }}>{amn.name}</h4>
                                    
                                    {isClosed ? (
                                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            CLOSED<br/><span style={{fontWeight: 'normal', fontSize: '0.75rem'}}>{matchedFacility?.closureReason || 'Maintenance'}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Click to Book</p>
                                            {matchedFacility?.supervisorName && (
                                                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                                                    <strong>Supervisor:</strong> {matchedFacility.supervisorName} <br/> 📞 {matchedFacility.supervisorPhone}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )})}
                        </div>

                        <h3>My Bookings</h3>
                        {amenityBookings.length === 0 ? <p>No bookings found.</p> : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Amenity</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {amenityBookings.map(b => (
                                            <tr key={b.id}>
                                                <td><span style={{ fontWeight: '600' }}>{b.amenity.replace('_', ' ')}</span></td>
                                                <td>{b.bookingDate}</td>
                                                <td>{b.isFullDay ? 'All Day' : `${b.startTime} - ${b.endTime}`}</td>
                                                <td>
                                                    <span className={`status-badge status-${b.status}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showBookingModal && (
                            <div className="modal-overlay">
                                <div className="modal-content" style={{ maxWidth: '500px' }}>
                                    <div className="modal-header">
                                        <h3 style={{ margin: 0 }}>New meeting</h3>
                                        <button className="close-btn" onClick={() => setShowBookingModal(false)}>&times;</button>
                                    </div>
                                    <form onSubmit={handleBookAmenity}>
                                        <div style={{ background: '#201f1f', color: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '20px' }}>
                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <input type="text" value={amenitiesList.find(a => a.id === selectedAmenity)?.name || ''} readOnly style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #757575', color: '#fff', fontSize: '1.2rem', padding: '10px 0', width: '100%' }} />
                                            </div>
                                            
                                            <div style={{ marginTop: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <button type="button" onClick={handlePrevMonth} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={20}/></button>
                                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{MONTH_NAMES[currentMonth]} {currentYear}</div>
                                                    <button type="button" onClick={handleNextMonth} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronRight size={20}/></button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
                                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{textAlign: 'center', color: '#888', fontSize: '0.8rem', fontWeight: '600'}}>{d}</div>)}
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '24px' }}>
                                                    {renderCalendar()}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', borderTop: '1px solid #444', paddingTop: '20px' }}>
                                                
                                                {!isFullDay && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <Clock size={16} color="#c8c6c4" />
                                                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required={!isFullDay} style={{ background: '#292828', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px' }} />
                                                        <span style={{ color: '#c8c6c4' }}>→</span>
                                                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required={!isFullDay} style={{ background: '#292828', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px' }} />
                                                    </div>
                                                )}

                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', cursor: 'pointer' }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#c8c6c4' }}>All day</span>
                                                    <div style={{ position: 'relative', width: '36px', height: '20px', background: isFullDay ? '#5c2d91' : '#424242', borderRadius: '10px', transition: 'background 0.3s' }}>
                                                        <input type="checkbox" checked={isFullDay} onChange={e => setIsFullDay(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                                                        <div style={{ position: 'absolute', top: '2px', left: isFullDay ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }}></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Close</button>
                                            <button type="submit" className="btn" style={{ background: '#5c2d91' }}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default ResidentDashboard;
