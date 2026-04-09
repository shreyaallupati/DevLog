import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('/auth/register', { username, email, password });
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. That email or username might be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[400px] bg-theme-bg border border-theme-border rounded-2xl shadow-sm p-8">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-bold text-theme-heading m-0 mb-2">Join DevLog</h2>
                    <p className="text-theme-text text-sm">Create an account to start publishing.</p>
                </div>

                {success ? (
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                        <div className="text-4xl mb-3">✨</div>
                        <h3 className="text-green-800 dark:text-green-400 font-bold mb-1">Account Created!</h3>
                        <p className="text-green-600 dark:text-green-500 text-sm">Redirecting you to login...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-theme-heading mb-1.5">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-theme-social border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all"
                                    placeholder="developer_123"
                                />
                            </div>

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
                                    minLength={6}
                                    className="w-full px-4 py-2.5 bg-theme-social border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all"
                                    placeholder="At least 6 characters"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full mt-2 px-4 py-3 font-medium text-white bg-theme-heading rounded-lg transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 shadow-sm hover:shadow active:scale-[0.98]'
                                    }`}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-theme-text border-t border-theme-border pt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-theme-heading font-medium hover:underline">
                                Log in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};