import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from 'react-markdown';

interface Post {
    id: string;
    title: string;
    content: string;
    cover_image_path: string | null;
    created_at: string;
    author: string;
}

export const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get("/posts");
                setPosts(response.data);
            } catch (err) {
                setError("Failed to load the feed.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const serverUrl = import.meta.env.VITE_API_URL.replace("/api", "");

    const handleDelete = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this DevLog?")) return;

        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (err: any) {
            console.error("Failed to delete post:", err);
            alert(err.response?.data?.error || "Failed to delete post.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-pulse text-theme-text text-lg font-medium">
                    Loading feed...
                </div>
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
            <div className="mb-10 border-b border-theme-border pb-6 flex items-end justify-between z-60">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-theme-heading tracking-tight m-0">
                        Latest DevLogs
                    </h1>
                    <p className="text-theme-text mt-2 text-sm sm:text-base">
                        See what the community is building.
                    </p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 px-6 bg-theme-social border border-theme-border rounded-xl border-dashed">
                    <p className="text-theme-text text-lg">
                        No posts yet. Be the first to publish one!
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            onClick={() => navigate(`/posts/${post.id}`)}
                            className="card card-hover relative group cursor-pointer z-60"
                        >
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-colors duration-300" />
                                <div className="relative opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-30">
                                    {/* --- UPDATED READ POST BUTTON (opaque light-blue) --- */}
                                    <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-200 text-blue-900 border border-blue-300 rounded-full font-semibold shadow-lg hover:bg-blue-300 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                                        Read Post
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            className="w-4 h-4 text-yellow-500"
                                        >
                                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                                            <path d="M20 2v4"/>
                                            <path d="M22 4h-4"/>
                                            <circle cx="4" cy="20" r="2"/>
                                        </svg>
                                    </div>
                                    {/* -------------------------------- */}

                                </div>
                            </div>
                            
                            {post.cover_image_path && (
                                <div className="w-full h-[250px] sm:h-[350px] overflow-hidden bg-theme-social">
                                    <img
                                        src={`${serverUrl}${post.cover_image_path}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                    />
                                </div>
                            )}

                            <div className="card-padding relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-sm text-theme-text font-medium">
                                    <div className="avatar w-6 h-6 text-xs">
                                        {post.author.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-theme-heading">{post.author}</span>
                                    <span className="text-theme-border mx-1">•</span>
                                    <span>
                                        {new Date(post.created_at).toLocaleDateString(undefined, {
                                            month: "short", day: "numeric", year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold text-theme-heading mb-4 leading-tight group-hover:text-theme-accent transition-colors">
                                    {post.title}
                                </h2>

                                {/* The 'prose' class gives it beautiful typography formatting. 
                                'dark:prose-invert' makes sure text stays readable in dark mode!
                                */}
                                <div className="prose prose-sm sm:prose-base prose-invert prose-p:font-mono prose-pre:bg-[#5a5e7a] prose-pre:border prose-pre:border-theme-border max-w-none bg-theme-code p-5 sm:p-6 rounded-xl border border-theme-border/50">
                                    <ReactMarkdown>{post.content}</ReactMarkdown>
                                </div>

                                {user?.username === post.author && (
                                    <div className="mt-6 pt-6 border-t border-theme-border flex justify-end">
                                        <button
                                            onClick={(e) => handleDelete(e, post.id)}
                                            className="relative z-30 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            Delete Post
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};