import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

// 1. Define our TypeScript Types
interface User {
    user_id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check for token when the app first loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const decoded = jwtDecode<User>(token);
            // Optional: Check if token is expired here (advanced)
            setUser(decoded);
        } catch (error) {
            console.error("Invalid token found in storage");
            localStorage.removeItem('token');
        }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
    };

    // 4. Custom Hook for easy access in our components
    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};