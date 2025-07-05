import React, { useState } from 'react';
import { Upload, FileText, Calendar, MessageSquare } from 'lucide-react';
import InputField from '../../shared/InputField';
import axios from 'axios';

function DocumentUploadForm({ patientId, onUploadSuccess, onError }) {
    const [formData, setFormData] = useState({
        description: '',
        last_checkup_date: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (file) => {
        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            onError('Please select a valid file type (PDF, DOC, DOCX, JPG, PNG)');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            onError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        onError(''); // Clear any previous errors
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // In DocumentUploadForm.js
    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   console.log('=== FRONTEND UPLOAD DEBUG ===');
    //   console.log('Selected file:', selectedFile);
    //   console.log('Patient ID:', patientId);
    //   console.log('Form data:', formData);

    //   if (!selectedFile) {
    //     onError('Please select a file to upload');
    //     return;
    //   }

    //   if (!patientId) {
    //     onError('Patient information is not available');
    //     return;
    //   }

    //   setUploading(true);
    //   onError('');

    //   try {
    //     // Test API connectivity first
    //     const testResponse = await fetch('/api/medical-documents/test');
    //     console.log('API test response:', testResponse.status);

    //     if (!testResponse.ok) {
    //       throw new Error('API endpoint not accessible');
    //     }

    //     const uploadFormData = new FormData();
    //     uploadFormData.append('medicalDoc', selectedFile);
    //     uploadFormData.append('patient_id', patientId);
    //     uploadFormData.append('description', formData.description);
    //     uploadFormData.append('last_checkup_date', formData.last_checkup_date);

    //     // Log FormData contents
    //     console.log('FormData contents:');
    //     for (let [key, value] of uploadFormData.entries()) {
    //       console.log(`${key}:`, value);
    //     }

    //     const response = await fetch('/api/medical-documents', {
    //       method: 'POST',
    //       body: uploadFormData
    //     });

    //     console.log('Upload response status:', response.status);
    //     console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

    //     if (!response.ok) {
    //       const errorText = await response.text();
    //       console.error('Upload failed response:', errorText);
    //       throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    //     }

    //     const result = await response.json();
    //     console.log('Upload successful:', result);
    //     onUploadSuccess(result);

    //     // Reset form
    //     setFormData({ description: '', last_checkup_date: '' });
    //     setSelectedFile(null);

    //   } catch (err) {
    //     console.error('Upload error details:', err);
    //     onError(`Failed to upload document: ${err.message}`);
    //   } finally {
    //     setUploading(false);
    //   }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ← new validation
        if (!formData.last_checkup_date) {
            onError('Please select a check-up date before uploading.');
            return;
        }
        if (!selectedFile) return onError('Please select a file to upload');

        setUploading(true);
        onError('');

        const uploadFormData = new FormData();
        uploadFormData.append('medicalDoc', selectedFile);
        uploadFormData.append('patient_id', patientId);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('last_checkup_date', formData.last_checkup_date);

        try {
            const { data } = await axios.post(
                '/api/medical-documents',
                uploadFormData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            console.log('Upload successful:', data);
            onUploadSuccess(data);
            setFormData({ description: '', last_checkup_date: '' });
            setSelectedFile(null);

        } catch (err) {
            console.error('Upload error:', err);
            onError(`Failed to upload document: ${err.response?.data?.error || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                    Upload Medical Document
                </label>

                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                        ? 'border-sky-400 bg-sky-50'
                        : selectedFile
                            ? 'border-green-400 bg-green-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="text-center">
                        {selectedFile ? (
                            <div className="space-y-2">
                                <FileText className="w-12 h-12 text-green-600 mx-auto" />
                                <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                                <p className="text-xs text-green-600">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="text-xs text-red-600 hover:text-red-700 underline"
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">
                                    PDF, DOC, DOCX, JPG, PNG (max 10MB)
                                </p>
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    icon={MessageSquare}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this document (e.g., Blood test results, X-ray)"
                    required
                />

                <InputField
                    icon={Calendar}
                    label="Last Checkup Date"
                    name="last_checkup_date"
                    type="date"
                    value={formData.last_checkup_date}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {uploading ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Upload Document</span>
                        </div>
                    )}
                </button>
            </div>
        </form>
    );
}

export default DocumentUploadForm;
