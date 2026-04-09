import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    // If the user is not logged in, redirect them immediately to /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, render the page they asked for
    return children;
};