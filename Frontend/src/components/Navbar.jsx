import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, handleLogut } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate('/')}>
                <span className="logo-text">AI Strategy<span className="highlight">Hub</span></span>
            </div>

            <div className="navbar-actions">
                <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                {user ? (
                    <div className="user-profile">
                        <span className="username">{user.username}</span>
                        <button className="logout-btn" onClick={handleLogut}>Logout</button>
                    </div>
                ) : (
                    <div className="auth-btns">
                        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                        <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
