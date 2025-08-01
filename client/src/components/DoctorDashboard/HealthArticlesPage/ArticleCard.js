import React, { useState } from 'react';
import { 
    User, 
    Calendar, 
    Tag, 
    Edit,
    Trash2,
    Eye,
    Heart,
    MessageCircle,
    Share
} from 'lucide-react';
import EditArticleModal from './EditArticleModal';
import axios from 'axios';
import ArticleImageDisplay from './ArticleImageDisplay';

const ArticleCard = ({ article, isOwner, onArticleUpdated }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        
        setIsDeleting(true);
        try {
            await axios.delete(`/api/health-articles/${article.article_id}`);
            onArticleUpdated();
        } catch (error) {
            console.error('Error deleting article:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Fixed truncateContent function with proper null/undefined handling
    const truncateContent = (content, maxLength = 200) => {
        // Handle undefined, null, or non-string content
        if (!content || typeof content !== 'string') {
            return 'No content available';
        }
        
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Ensure article object has required properties with fallbacks
    const safeArticle = {
        title: article?.title || 'Untitled Article',
        content: article?.content || '',
        first_name: article?.first_name || 'Unknown',
        last_name: article?.last_name || 'Doctor',
        published_at: article?.published_at || new Date().toISOString(),
        category: article?.category || 'General',
        image_path: article?.image_path || null,
        article_id: article?.article_id,
        doctor_id: article?.doctor_id
    };

    return (
        <>
            <article className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">
                                    Dr. {safeArticle.first_name} {safeArticle.last_name}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(safeArticle.published_at)}</span>
                                    </div>
                                    {safeArticle.category && (
                                        <div className="flex items-center space-x-1">
                                            <Tag className="w-3 h-3" />
                                            <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
                                                {safeArticle.category}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions for owner */}
                        {isOwner && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                    title="Edit article"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete article"
                                >
                                    {isDeleting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Article Content */}
                <div className="px-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                        {safeArticle.title}
                    </h2>
                    
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed">
                            {showFullContent ? safeArticle.content : truncateContent(safeArticle.content)}
                        </p>
                        
                        {safeArticle.content && safeArticle.content.length > 200 && (
                            <button
                                onClick={() => setShowFullContent(!showFullContent)}
                                className="text-sky-600 hover:text-sky-700 font-medium text-sm mt-2 inline-flex items-center space-x-1"
                            >
                                <Eye className="w-4 h-4" />
                                <span>{showFullContent ? 'Show less' : 'Read more'}</span>
                            </button>
                        )}
                    </div>
                </div>

               {/* Article Image - Updated for correct path */}
{safeArticle.image_path && (
    <div className="px-6 mt-4">
        <div className="relative group">
            <img 
                src={`http://localhost:5000/uploads/article_images/${safeArticle.image_path.replace(/^.*[\\/]/, '')}`}
                alt={safeArticle.title}
                className="w-full max-h-96 object-cover rounded-lg shadow-sm cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    // Try alternative path if the first one fails
                    if (!e.target.src.includes('/article_images/')) {
                        e.target.src = `http://localhost:5000/uploads/${safeArticle.image_path}`;
                    } else {
                        e.target.style.display = 'none';
                    }
                }}
                onClick={(e) => {
                    // Open in modal for full view
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4';
                    modal.innerHTML = `
                        <div class="relative max-w-4xl max-h-full">
                            <img src="${e.target.src}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                            <button class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                    modal.onclick = (e) => {
                        if (e.target === modal || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'path') {
                            document.body.removeChild(modal);
                        }
                    };
                    document.body.appendChild(modal);
                }}
            />
            
            {/* Image overlay with info */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                    Click to enlarge
                </span>
            </div>
        </div>
    </div>
)}



                {/* Footer */}
                <div className="p-6 pt-4 border-t border-slate-100 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">Like</span>
                            </button>
                            <button className="flex items-center space-x-2 text-slate-500 hover:text-sky-500 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">Comment</span>
                            </button>
                            <button className="flex items-center space-x-2 text-slate-500 hover:text-green-500 transition-colors">
                                <Share className="w-4 h-4" />
                                <span className="text-sm">Share</span>
                            </button>
                        </div>
                        
                        {isOwner && (
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                Your Article
                            </span>
                        )}
                    </div>
                </div>
            </article>

            {/* Edit Modal */}
            {showEditModal && (
                <EditArticleModal
                    article={safeArticle}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onArticleUpdated={onArticleUpdated}
                />
            )}
        </>
    );
};

export default ArticleCard;
