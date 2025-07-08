//components/PatientDashboard/hooks/useDoctors.js

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/doctors');
            const filteredDoctors = response.data.filter(
                doctor => doctor.department_name !== 'Unassigned'
            );
            setDoctors(filteredDoctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        doctors,
        loading,
        fetchDoctors
    };
};
