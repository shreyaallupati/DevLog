import multer from 'multer';
import path from 'path';

// Configure how and where files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save all files to the public/uploads directory
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // SDE Standard: Generate a unique filename using the current timestamp
        // e.g., "1697041234567-myimage.jpg"
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the upload middleware. We will use .single() later for one file.
export const upload = multer({ 
    storage: storage,
    // Optional but recommended: Only allow images
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
        cb(null, true);
        } else {
        cb(new Error('Only image files are allowed!'));
        }
    }
});