import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAppointments = (
    patientId,
    activeTab,
    searchTerm,
    setPrescription,
    setShowPrescriptionModal,
    setSelectedAppointment,
    setShowReportModal,
    reportFile,
    setReportFile
) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch appointments
    const fetchAppointments = useCallback(async () => {
        if (!patientId) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`/api/appointments/patient/${patientId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Filter appointments by status and search
    const filteredAppointments = appointments
        .filter(apt => apt.status === activeTab)
        .filter(apt => 
            searchTerm === '' || 
            apt.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateA - dateB;
        });

    // Delete appointment
    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/appointments/${appointmentId}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment. Please try again.');
        }
    };

    // View prescription
    const handleViewPrescription = async (appointmentId) => {
        try {
            const response = await axios.get(`/api/prescriptions/appointment/${appointmentId}`);
            setPrescription(response.data);
            setShowPrescriptionModal(true);
        } catch (error) {
            console.error('Error fetching prescription:', error);
            if (error.response?.status === 404) {
                alert('No prescription found for this appointment.');
            } else {
                alert('Failed to fetch prescription. Please try again.');
            }
        }
    };

    // Upload investigation report
    const handleUploadReport = (appointment) => {
        setSelectedAppointment(appointment);
        setShowReportModal(true);
    };

    const submitReport = async (e, selectedAppointment, prescription) => {
        e.preventDefault();
        if (!reportFile || !selectedAppointment) return;

        const formData = new FormData();
        formData.append('reportFile', reportFile);
        formData.append('prescription_id', prescription?.prescription_id);
        formData.append('investigation_id', 1);
        formData.append('notes', 'Patient uploaded report');

        try {
            await axios.post('/api/investigation-reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowReportModal(false);
            setReportFile(null);
            alert('Report uploaded successfully!');
        } catch (error) {
            console.error('Error uploading report:', error);
            alert('Failed to upload report. Please try again.');
        }
    };

    return {
        appointments,
        loading,
        filteredAppointments,
        handleDeleteAppointment,
        handleViewPrescription,
        handleUploadReport,
        submitReport
    };
};
