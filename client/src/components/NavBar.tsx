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
            <div className="max-w-[800px] mx-auto px-4 py-4 flex items-center justify-between">

                {/* Left Side: Brand Logo */}
                <div className="flex items-center">
                    <Link
                        to="/"
                        className="text-2xl font-heading font-bold text-theme-heading tracking-tight no-underline hover:opacity-80 transition-opacity"
                    >
                        DevLog<span className="text-theme-accent">.</span>
                    </Link>
                </div>

                {/* Right Side: Navigation & Auth */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/create"
                                className="hidden sm:flex px-4 py-2 text-sm font-medium text-theme-bg bg-theme-heading rounded-md hover:opacity-80 transition-opacity no-underline shadow-sm"
                            >
                                ✍️ Write Post
                            </Link>

                            {/* Vertical Divider */}
                            <div className="w-px h-6 bg-theme-border hidden sm:block"></div>

                            <Link
                                to="/profile"
                                className="flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors no-underline"
                                title="Go to Profile"
                            >
                                {/* Dynamic User Avatar */}
                                <div className="w-8 h-8 rounded-full bg-theme-accent-bg border border-theme-accent-border flex items-center justify-center text-theme-accent font-bold">
                                    {user?.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden sm:block">{user?.username}</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-theme-text hover:text-theme-heading transition-colors no-underline"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-theme-accent rounded-md hover:opacity-90 transition-opacity no-underline shadow-sm"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};