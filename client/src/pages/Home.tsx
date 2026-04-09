import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this DevLog?")) return;

        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (err: any) {
            console.error("Failed to delete post:", err);
            alert(err.response?.data?.error || "Failed to delete post.");
        }
    };

    // Loading & Error States styled nicely
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
        <div className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
            {/* Page Header */}
            <div className="mb-10 border-b border-theme-border pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-theme-heading tracking-tight m-0">
                        Latest DevLogs
                    </h1>
                    <p className="text-theme-text mt-2 text-sm sm:text-base">
                        See what the community is building.
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {posts.length === 0 ? (
                <div className="text-center py-20 px-6 bg-theme-social border border-theme-border rounded-xl border-dashed">
                    <p className="text-theme-text text-lg">
                        No posts yet. Be the first to publish one!
                    </p>
                </div>
            ) : (
                /* Feed Grid */
                <div className="flex flex-col gap-10">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-theme-bg border border-theme-border rounded-2xl overflow-hidden shadow-sm hover:shadow-theme transition-all duration-300"
                        >
                            {/* Cover Image (if exists) */}
                            {post.cover_image_path && (
                                <div className="w-full h-[250px] sm:h-[350px] overflow-hidden bg-theme-social">
                                    <img
                                        src={`${serverUrl}${post.cover_image_path}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                    />
                                </div>
                            )}

                            {/* Post Content Area */}
                            <div className="p-6 sm:p-8">
                                {/* Meta Data */}
                                <div className="flex items-center gap-2 mb-4 text-sm text-theme-text font-medium">
                                    <div className="w-6 h-6 rounded-full bg-theme-accent-bg text-theme-accent flex items-center justify-center text-xs font-bold">
                                        {post.author.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-theme-heading">{post.author}</span>
                                    <span className="text-theme-border mx-1">•</span>
                                    <span>
                                        {new Date(post.created_at).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold text-theme-heading mb-4 leading-tight">
                                    {post.title}
                                </h2>

                                <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-theme-text bg-theme-code p-5 rounded-xl border border-theme-border/50">
                                    {post.content}
                                </p>

                                {/* Delete Button (Only visible to Author) */}
                                {user?.username === post.author && (
                                    <div className="mt-6 pt-6 border-t border-theme-border">
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            🗑️ Delete Post
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
