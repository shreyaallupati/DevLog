import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <div>
            <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>🏠 Home</Link>
            {isAuthenticated && (
            <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>✍️ Create Post</Link>
            )}
        </div>
        
        <div>
            {isAuthenticated ? (
            <>
                <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
                <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
            </>
            ) : (
            <>
                <Link to="/login" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            </>
            )}
        </div>
        </nav>
    );
};