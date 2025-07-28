import React, { useState } from 'react';
import axios from 'axios';
import { 
    PenTool, 
    ImageIcon, 
    Send, 
    X,
    Upload,
    FileText
} from 'lucide-react';

const ArticleCreationSection = ({ doctorId, onArticleCreated, categories }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (file) => {
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewUrl(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('doctor_id', doctorId);
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('category', formData.category);
            
            if (selectedFile) {
                submitData.append('articleImage', selectedFile);
            }

            await axios.post('/api/health-articles', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Reset form
            setFormData({ title: '', content: '', category: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
            setIsExpanded(false);
            onArticleCreated();
        } catch (error) {
            console.error('Error creating article:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            {/* Compact Header */}
            {!isExpanded && (
                <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                            <PenTool className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-500 text-sm">Share your medical knowledge...</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                            <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>
            )}

            {/* Expanded Form */}
            {isExpanded && (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <PenTool className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Create Health Article</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Title Input */}
                    <div>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Article title..."
                            className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Content Textarea */}
                    <div>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Share your medical insights, research findings, or health tips..."
                            rows={6}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none transition-all duration-200"
                            required
                        />
                    </div>

                    {/* File Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragActive 
                                ? 'border-sky-400 bg-sky-50' 
                                : 'border-slate-300 hover:border-slate-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-3">
                                {previewUrl ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <FileText className="w-12 h-12 text-slate-400" />
                                    </div>
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
                            <div className="space-y-2">
                                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                                <div>
                                    <label htmlFor="articleImage" className="cursor-pointer">
                                        <span className="text-sky-600 hover:text-sky-700 font-medium">
                                            Choose an image
                                        </span>
                                        <span className="text-slate-500"> or drag and drop</span>
                                    </label>
                                    <input
                                        id="articleImage"
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <ImageIcon className="w-4 h-4" />
                            <span>Add images or documents</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Publish Article</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ArticleCreationSection;
