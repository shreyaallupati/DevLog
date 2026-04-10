import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // Notice the TypeScript type here: it's a physical File object, or null
    const [coverImage, setCoverImage] = useState<File | null>(null); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // SDE Expert Skill: Constructing the FormData payload
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

    // Helper to safely grab the file from the input element
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setCoverImage(e.target.files[0]);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>✍️ Create a New DevLog</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.5rem' }}
            />
            </div>

            <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cover Image</label>
            {/* Note: value={...} is NOT used on file inputs for security reasons */}
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ width: '100%', padding: '0.5rem' }}
            />
            </div>
            
            <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content (Markdown/Text)</label>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
                rows={8}
                style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
            />
            </div>
            
            <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '0.75rem', background: isLoading ? '#666' : '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
            {isLoading ? 'Publishing...' : 'Publish Post'}
            </button>
        </form>
        </div>
    );
};