import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../shared/Modal';
import { Upload, X, FileText } from 'lucide-react';

const EditArticleModal = ({ article, isOpen, onClose, onArticleUpdated }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState(null);

    const categories = [
        'General Health',
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'Mental Health',
        'Nutrition',
        'Preventive Care'
    ];

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title || '',
                content: article.content || '',
                category: article.category || ''
            });
            setCurrentImagePath(article.image_path);
        }
    }, [article]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const removeCurrentImage = () => {
        setCurrentImagePath(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('category', formData.category);
            
            if (selectedFile) {
                submitData.append('articleImage', selectedFile);
            }

            await axios.patch(`/api/health-articles/${article.article_id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onArticleUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating article:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Article"
            subtitle="Update your health article"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Article Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Content *
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={8}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                        required
                    />
                </div>

                {/* Current Image */}
                {currentImagePath && !selectedFile && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Current Image
                        </label>
                        <div className="relative inline-block">
                            <img 
                                src={`${axios.defaults.baseURL}/${currentImagePath}`}
                                alt="Current article" 
                                className="max-w-full max-h-48 rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={removeCurrentImage}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {currentImagePath ? 'Replace Image' : 'Add Image'}
                    </label>
                    {selectedFile ? (
                        <div className="space-y-3">
                            {previewUrl && (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
                                />
                            )}
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-sm text-slate-600">{selectedFile.name}</span>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <label htmlFor="editArticleImage" className="cursor-pointer">
                                <span className="text-sky-600 hover:text-sky-700 font-medium">
                                    Choose an image
                                </span>
                                <span className="text-slate-500"> or drag and drop</span>
                            </label>
                            <input
                                id="editArticleImage"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Updating...</span>
                            </div>
                        ) : (
                            'Update Article'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditArticleModal;
