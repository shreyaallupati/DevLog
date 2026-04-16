import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReactMarkdown from 'react-markdown';

interface Post {
    id: string;
    title: string;
    content: string;
    cover_image_path: string | null;
    created_at: string;
    author: string;
}

export const ReadPost = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Strip '/api' from the end of the URL for serving static images
    const serverUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Fetch the single post based on the ID in the URL
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Failed to load post:", err);
                setError("Could not load this DevLog. It may have been deleted or the URL is incorrect.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    // ----------------------------------------
    // Loading & Error States
    // ----------------------------------------
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse text-theme-text text-lg font-medium">
                    Loading DevLog...
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-4 text-center">
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Post not found"}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-200 transition-colors dark:bg-slate-800 dark:text-white dark:border-slate-700"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // Main Post Render
    // ----------------------------------------
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 animate-fade-in z-60">
            {/* Back Navigation */}
            <button 
                onClick={() => navigate(-1)} // Goes back to the previous page
                className="group flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors mb-8 sm:mb-12"
            >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                Back to Feed
            </button>

            {/* Optional Cover Image */}
            {post.cover_image_path && (
                <div className="w-full h-[300px] sm:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 shadow-sm bg-theme-social border border-theme-border">
                    <img
                        src={`${serverUrl}${post.cover_image_path}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Post Header */}
            <header className="mb-7 sm:mb-1 bg-black-900 border-black-800 rounded-xl">
                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white-600 dark:text-blue-400 leading-[1.15] tracking-tight mb-6">
                    {post.title}
                </h1>

                {/* Author & Date Meta */}
                <div className="flex items-center gap-3 p-6 border-b border-theme-border  rounded-2xl" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-full bg-theme-accent-bg text-theme-accent flex items-center justify-center text-lg font-bold">
                        {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-theme-heading font-semibold">
                            {post.author}
                        </span>
                        <span className="text-sm text-theme-text">
                            {new Date(post.created_at).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
            </header>

        {/* Post Content */}
            <article className="mt-8 flex flex-col w-full items-stretch z-60 relative">
                <div
                    className="flex-1 w-full min-h-[200px] p-6 sm:p-8 rounded-2xl border shadow-sm relative z-60"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                    <div className="prose prose-base sm:prose-lg prose-invert max-w-none prose-p:font-mono prose-headings:font-bold prose-headings:text-theme-heading text-theme-text prose-a:text-theme-accent break-words">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    );
};