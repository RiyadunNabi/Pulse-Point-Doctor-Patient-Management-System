import { useState } from 'react';

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadPrescriptionFiles = async (prescriptionId, files) => {
        if (files.length === 0) {
            return { success: true, data: [] };
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('prescription_id', prescriptionId);
            
            files.forEach((file) => {
                formData.append('prescriptionFiles', file);
            });

            const response = await fetch('/api/prescription-files', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload files');
            }

            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setUploading(false);
        }
    };

    const getPrescriptionFiles = async (prescriptionId) => {
        setError(null);

        try {
            const response = await fetch(`/api/prescription-files/prescription/${prescriptionId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch files');
            }

            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const downloadPrescriptionFile = async (fileId) => {
        try {
            const response = await fetch(`/api/prescription-files/${fileId}/download`);
            
            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'prescription-file';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const deletePrescriptionFile = async (fileId) => {
        setError(null);

        try {
            const response = await fetch(`/api/prescription-files/${fileId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete file');
            }

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    return {
        uploading,
        error,
        uploadPrescriptionFiles,
        getPrescriptionFiles,
        downloadPrescriptionFile,
        deletePrescriptionFile,
    };
};
