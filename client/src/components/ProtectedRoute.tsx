import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute used as a wrapper for nested routes must render an <Outlet />
export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // If the user is not logged in, redirect them immediately to /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, render the nested route(s)
    return <Outlet />;
};