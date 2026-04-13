import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login. Check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 z-60">
            
            {/* Back Navigation Container */}
            <div className="w-full max-w-md mb-6">
                <button 
                    onClick={() => navigate('/')} 
                    className="group flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors w-max"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Feed
                </button>
            </div>

            <div className="w-full max-w-md bg-theme-bg border border-theme-border rounded-2xl shadow-theme p-8">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-bold text-theme-heading m-0 mb-2">Welcome back</h2>
                    <p className="text-theme-text text-sm">Enter your credentials to access your account.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-theme-heading mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-theme-social border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-theme-heading mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-theme-social border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-2 px-4 py-3 font-medium text-white bg-theme-accent rounded-lg transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 shadow-sm hover:shadow active:scale-[0.98]'
                            }`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-theme-text border-t border-theme-border pt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-theme-accent font-medium hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};