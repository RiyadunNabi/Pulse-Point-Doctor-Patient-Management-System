import React, { useRef } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

const FileUpload = ({ files, onChange }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => {
            const isValidType = file.type.includes('pdf') || file.type.includes('image');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });
        
        onChange([...files, ...validFiles]);
        e.target.value = '';
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const getFileIcon = (file) => {
        if (file.type.includes('pdf')) {
            return <FileText className="w-5 h-5 text-red-500" />;
        } else if (file.type.includes('image')) {
            return <Image className="w-5 h-5 text-blue-500" />;
        }
        return <FileText className="w-5 h-5 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
                <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">
                        Click to upload prescription files
                    </p>
                    <p className="text-sm text-gray-500">
                        PDF or Image files (Max 10MB each)
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Selected Files:</h4>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                            <div className="flex items-center space-x-3">
                                {getFileIcon(file)}
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
