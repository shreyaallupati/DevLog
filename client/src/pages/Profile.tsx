import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';

interface Post {
    id: string;
    title: string;
    content: string;
    cover_image_path: string | null;
    created_at: string;
    author: string;
}

export const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await api.get('/posts/me');
                setMyPosts(response.data);
            } catch (err) {
                setError('Failed to load your profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, []);

    const serverUrl = import.meta.env.VITE_API_URL.replace('/api', '');

    const handleDelete = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this DevLog?')) return;
        try {
            await api.delete(`/posts/${postId}`);
            setMyPosts(myPosts.filter(post => post.id !== postId));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete post.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-pulse text-theme-text text-lg font-medium">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
            
            {/* Back Navigation */}
            <button 
                onClick={() => navigate('/')} 
                className="group flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors mb-8 sm:mb-10"
            >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                Back to Feed
            </button>

            {/* Profile Header Card */}
            <div className="bg-theme-bg border border-theme-border rounded-2xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-sm">
                <div className="w-24 h-24 rounded-full bg-theme-accent-bg text-theme-accent flex items-center justify-center text-4xl font-bold border-2 border-theme-accent-border flex-shrink-0">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-theme-heading m-0 mb-2">
                        {user?.username}
                    </h1>
                    <p className="text-theme-text text-sm sm:text-base m-0">
                        Manage your DevLogs and account details. You have published <strong className="text-theme-heading">{myPosts.length}</strong> posts.
                    </p>
                </div>
            </div>

            <div className="mb-6 border-b border-theme-border pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-theme-heading m-0">
                    Your Publications
                </h2>
            </div>

            {myPosts.length === 0 ? (
                <div className="text-center py-16 px-6 bg-theme-social border border-theme-border rounded-xl border-dashed">
                    <p className="text-theme-text">You haven't published any DevLogs yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {myPosts.map((post) => (
                        <div
                            key={post.id}
                            className="group flex flex-col sm:flex-row bg-theme-bg border border-theme-border rounded-xl overflow-hidden shadow-sm hover:shadow-theme transition-all duration-300"
                        >
                            {post.cover_image_path && (
                                <div className="w-full sm:w-48 lg:w-56 h-48 sm:h-auto flex-shrink-0 bg-theme-social overflow-hidden">
                                    <img
                                        src={`${serverUrl}${post.cover_image_path}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                    />
                                </div>
                            )}

                            <div className="p-5 sm:p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h3 className="text-xl font-bold text-theme-heading m-0 leading-tight">
                                        {post.title}
                                    </h3>
                                    <span className="text-xs font-medium text-theme-text bg-theme-social px-2.5 py-1 rounded-md whitespace-nowrap border border-theme-border/50">
                                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                {/* We wrap the ReactMarkdown inside a line-clamp div to keep the dashboard clean */}
                                <div className="line-clamp-2 mb-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:font-mono prose-headings:font-bold">
                                    <ReactMarkdown>{post.content}</ReactMarkdown>
                                </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-theme-border flex justify-end">
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};