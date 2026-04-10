import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        if (coverImage) {
            formData.append('coverImage', coverImage); 
        }

        try {
            await api.post('/posts', formData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create post. Check the console.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
            
            {/* Back Navigation */}
            <button 
                onClick={() => navigate('/')} 
                className="group flex items-center gap-2 text-sm font-medium text-theme-text hover:text-theme-heading transition-colors mb-8 sm:mb-10"
            >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                Back to Feed
            </button>

            <div className="bg-theme-bg border border-theme-border rounded-2xl shadow-theme p-6 sm:p-8">
                
                {/* --- UPDATED HEADING WITH SVG --- */}
                <div className="flex items-center gap-3 mb-6">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-8 h-8 text-theme-heading"
                    >
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                        <path d="m15 5 4 4"/>
                    </svg>
                    <h2 className="text-3xl font-heading font-bold text-theme-heading m-0">Create a New DevLog</h2>
                </div>
                {/* -------------------------------- */}

                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-theme-heading mb-1.5">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 bg-theme-social border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all"
                            placeholder="My amazing feature update..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-theme-heading mb-1.5">Cover Image (Optional)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="w-full px-4 py-2 bg-theme-social border border-theme-border rounded-lg text-theme-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-theme-accent file:text-white hover:file:opacity-90 cursor-pointer"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-theme-heading mb-1.5">Content (Markdown/Text)</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required 
                            rows={8}
                            className="w-full px-4 py-3 font-mono text-sm leading-relaxed bg-theme-code border border-theme-border rounded-lg text-theme-heading focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent transition-all resize-y"
                            placeholder="Write your logs here..."
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full mt-2 px-4 py-3 font-medium text-white bg-theme-accent rounded-lg transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 shadow-sm active:scale-[0.98]'}`}
                    >
                        {isLoading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};