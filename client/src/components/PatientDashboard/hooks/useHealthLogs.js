//components/PatientDashboard/hooks/useHealthLogs.js

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useHealthLogs = (patientId) => {
    const [healthLogs, setHealthLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHealthLogs = useCallback(async () => {
        if (!patientId) {
            console.error('No patient_id available for health logs');
            return;
        }

        try {
            console.log('Fetching health logs for patient ID:', patientId);
            const response = await axios.get(`/api/health-logs/patient/${patientId}`);
            console.log('Health logs received:', response.data);
            setHealthLogs(response.data);
        } catch (error) {
            console.error('Error fetching health logs:', error);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    return {
        healthLogs,
        loading,
        fetchHealthLogs
    };
};
