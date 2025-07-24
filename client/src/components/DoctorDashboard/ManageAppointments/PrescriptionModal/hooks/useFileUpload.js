//client/src/components/DoctorDashboard/ManageAppointments/PrescriptionModal/hooks/
import { useState } from 'react';
import axios from '../../../../../utils/axiosConfig';

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
            // const token = localStorage.getItem('token');
            // if (!token) throw new Error('Authentication token not found');

            const formData = new FormData();
            formData.append('prescription_id', prescriptionId);
            
            files.forEach((file) => {
                formData.append('prescriptionFiles', file);
            });

            // const response = await fetch('/api/prescription-files', {
            //     method: 'POST',
            //     headers: { 'Authorization': `Bearer ${token}` },
            //     body: formData,
            // });

            // const data = await response.json();

            // if (!response.ok) {
            //     throw new Error(data.error || 'Failed to upload files');
            // }

            // return { success: true, data };
            const { data } = await axios.post('/api/prescription-files', formData);
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
            // const response = await fetch(`/api/prescription-files/prescription/${prescriptionId}`);
            // const data = await response.json();

            // if (!response.ok) {
            //     throw new Error(data.error || 'Failed to fetch files');
            // }

            // return { success: true, data };
            const { data } = await axios.get(`/api/prescription-files/prescription/${prescriptionId}`);
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const downloadPrescriptionFile = async (fileId) => {
        try {
            // const response = await fetch(`/api/prescription-files/${fileId}/download`);
            
            // if (!response.ok) {
            //     throw new Error('Failed to download file');
            // }

            // const blob = await response.blob();

            const response = await axios.get(`/api/prescription-files/${fileId}/download`, { responseType: 'blob' });
            const blob = response.data;

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
            // const response = await fetch(`/api/prescription-files/${fileId}`, {
            //     method: 'DELETE',
            // });

            // if (!response.ok) {
            //     const data = await response.json();
            //     throw new Error(data.error || 'Failed to delete file');
            // }
            await axios.delete(`/api/prescription-files/${fileId}`);
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
