//client\src\components\DoctorDashboard\ManageAppointments\PrescriptionModal\hooks\usePrescriptionData.js
import { useState } from 'react';
import axios from '../../../../../utils/axiosConfig';

export const usePrescriptionData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPrescription = async (prescriptionData) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post('/api/prescriptions', prescriptionData);
            return { success: true, data };

        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const getPrescriptionByAppointmentId = async (appointmentId) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(`/api/prescriptions/appointment/${appointmentId}`);
            return { success: true, data };

        } catch (err) {
            if (err.response?.status === 404) {
                // no prescription exists yet
                return { success: true, data: null };
            }
            // real error
            setError(err.response?.data?.error || err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePrescription = async (prescriptionId, updateData) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.patch(
                `/api/prescriptions/${prescriptionId}`,
                updateData
            );
            return { success: true, data };
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        createPrescription,
        getPrescriptionByAppointmentId,
        updatePrescription,
    };
};
