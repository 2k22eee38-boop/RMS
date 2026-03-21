import React, { useState } from 'react';
import { LogOut, Menu, X, Building2 } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ title, tabs, activeTab, setActiveTab, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleTabClick = (id) => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="top-navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Building2 size={28} color="var(--primary)" />
                    <h2>{title}</h2>
                </div>
                
                {/* Desktop Menu */}
                <div className="navbar-menu desktop-menu">
                    <div className="nav-links">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.icon && <span className="nav-icon">{tab.icon}</span>}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-secondary logout-btn" onClick={onLogout}>
                        <LogOut size={16} /> <span className="logout-text">Logout</span>
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.icon && <span className="nav-icon">{tab.icon}</span>}
                            {tab.label}
                        </button>
                    ))}
                    <button className="btn btn-secondary logout-btn mobile-logout" onClick={onLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
