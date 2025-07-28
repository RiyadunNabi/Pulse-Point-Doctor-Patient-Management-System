// Create a helper for consistent image URLs
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const cleanPath = imagePath.replace(/^uploads\//, '');
    
    return `${baseURL}/uploads/${cleanPath}`;
};

export const handleImageError = (e, fallbackSrc = null) => {
    console.error('Image failed to load:', e.target.src);
    if (fallbackSrc) {
        e.target.src = fallbackSrc;
    } else {
        e.target.style.display = 'none';
    }
};
