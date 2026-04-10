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
        <nav className="sticky top-0 z-50 w-full border-b border-theme-border bg-theme-bg/80 backdrop-blur-md">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-heading font-bold text-theme-heading tracking-tight no-underline hover:opacity-80 transition-opacity">
                        DevLog<span className="text-theme-accent">.</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    {isAuthenticated ? (
                        <>
                            <Link to="/create" className="hidden sm:flex btn btn-primary py-1.5 text-sm">
                                ✍️ Write Post
                            </Link>

                            <div className="w-px h-6 bg-theme-border hidden sm:block"></div>

                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors no-underline" title="Go to Profile">
                                <div className="avatar w-8 h-8 text-sm">
                                    {user?.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden sm:block">{user?.username}</span>
                            </Link>

                            <button onClick={handleLogout} className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-theme-text hover:text-theme-heading transition-colors no-underline">
                                Log in
                            </Link>
                            <Link to="/register" className="btn btn-primary py-1.5 text-sm">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};