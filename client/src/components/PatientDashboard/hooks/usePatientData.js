//components/PatientDashboard/hooks/usePatientData.js

import { useState, useCallback } from 'react';
import axios from 'axios';

export const usePatientData = (user, onLogout) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPatientData = useCallback(async () => {
        if (!user?.patient_id) {
            console.error('No patient_id available');
            setError('Patient ID not found. Please log in again.');
            return;
        }

        try {
            console.log('Fetching patient data for ID:', user.patient_id);
            const response = await axios.get(`/api/patients/${user.patient_id}`);
            console.log('Patient data received:', response.data);
            
            setPatient(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching patient data:', error);
            if (error.response?.status === 404) {
                console.log('Patient profile not found, creating basic profile from user data');
                const basicPatient = {
                    patient_id: user.patient_id,
                    user_id: user.user_id,
                    first_name: user.username || 'Patient',
                    last_name: '',
                    gender: null,
                    date_of_birth: null,
                    phone_no: null,
                    address: null,
                    blood_group: null,
                    health_condition: null,
                    email: user.email,
                    is_active: true,
                    isIncomplete: true
                };
                setPatient(basicPatient);
                setError('');
            } else if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                onLogout();
            } else {
                setError('Failed to load patient information. Please try refreshing the page.');
            }
        } finally {
            setLoading(false);
        }
    }, [user?.patient_id, user?.username, user?.email, user?.user_id, onLogout]);

    const handlePatientUpdate = (updatedPatient) => {
        if (updatedPatient && updatedPatient.patient_id) {
            console.log('Patient updated successfully:', updatedPatient);
            setPatient(updatedPatient);
        } else {
            console.error('Invalid patient update data:', updatedPatient);
        }
    };

    return {
        patient,
        loading,
        error,
        fetchPatientData,
        handlePatientUpdate
    };
};
