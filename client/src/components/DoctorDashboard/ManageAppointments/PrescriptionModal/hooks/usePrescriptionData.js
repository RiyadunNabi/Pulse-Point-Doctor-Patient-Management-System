import { useState } from 'react';

export const usePrescriptionData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPrescription = async (prescriptionData) => {
        setLoading(true);
        setError(null);

        try {
            // const response = await fetch('/api/prescriptions', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(prescriptionData),
            // });
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found in local storage.");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/prescriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(prescriptionData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create prescription');
            }

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
            const response = await fetch(`/api/prescriptions/appointment/${appointmentId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch prescription');
            }

            return { success: true, data };
        } catch (err) {
            setError(err.message);
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
    };
};
