import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    Event Manager
                </Link>
            </div>

            <div className="navbar-menu">
                {currentUser ? (
                    <>
                        <Link to="/events" className="nav-link">
                            <i className="fas fa-search"></i> Search Events
                        </Link>
                        <Link to="/calendar" className="nav-link">
                            <i className="fas fa-calendar-alt"></i> Calendar
                        </Link>
                        <Link to="/events/create" className="nav-link create-event">
                            <i className="fas fa-plus"></i> Create Event
                        </Link>
                        <Link to="/events/add" className="nav-link">
                            <i className="fas fa-plus"></i> Events Adding
                        </Link>
                        <div className="nav-user">
                            <span className="user-name">
                                <i className="fas fa-user"></i> {currentUser.name}
                            </span>
                            <button onClick={handleLogout} className="logout-button">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="auth-buttons">
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
