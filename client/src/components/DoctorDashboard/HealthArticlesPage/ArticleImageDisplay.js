import React, { useState } from 'react';
import { Maximize2, Download, X } from 'lucide-react';

const ArticleImageDisplay = ({ imagePath, title, showDownload = false }) => {
    const [imageError, setImageError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!imagePath || imageError) return null;

    // Clean up the image path - extract just the filename
    const fileName = imagePath.replace(/^.*[\\/]/, '');
    const imageUrl = `http://localhost:5000/uploads/article_images/${fileName}`;
    
    // Fallback URL in case the image is in the main uploads folder
    const fallbackUrl = `http://localhost:5000/uploads/${imagePath}`;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `article-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="relative group">
                <div className="relative overflow-hidden rounded-lg shadow-sm bg-slate-100">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                        </div>
                    )}
                    
                    <img 
                        src={imageUrl}
                        alt={title || 'Article image'}
                        className="w-full max-h-96 object-cover transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                        onLoad={() => setLoading(false)}
                        onError={(e) => {
                            console.error('Primary image path failed:', imageUrl);
                            // Try fallback path
                            if (e.target.src === imageUrl) {
                                console.log('Trying fallback path:', fallbackUrl);
                                e.target.src = fallbackUrl;
                            } else {
                                console.error('Both image paths failed');
                                setImageError(true);
                                setLoading(false);
                            }
                        }}
                        onClick={() => setShowModal(true)}
                    />
                    
                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                                className="p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-lg transition-all"
                                title="View full size"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                            
                            {showDownload && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload();
                                    }}
                                    className="p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-lg transition-all"
                                    title="Download image"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-size Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div className="relative max-w-6xl max-h-full">
                        <img 
                            src={imageUrl}
                            alt={title || 'Article image'}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        {/* Download button */}
                        {showDownload && (
                            <button
                                onClick={handleDownload}
                                className="absolute top-4 right-16 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all"
                            >
                                <Download className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ArticleImageDisplay;
