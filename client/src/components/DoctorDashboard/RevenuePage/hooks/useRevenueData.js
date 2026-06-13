import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

function useRevenueData(doctorId) {
    const [revenueStats, setRevenueStats] = useState({});
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!doctorId) return;

        const fetchStaticData = async () => {
            try {
                const response = await axios.get(`/api/payments/doctor/${doctorId}/static-stats`);
                const apiStatsData = response.data;
                setRevenueStats({
                    today: apiStatsData.today || 0,
                    thisMonth: apiStatsData.this_month || 0,
                    thisYear: apiStatsData.this_year || 0,
                    total: apiStatsData.total || 0
                });
            } catch (err) {
                console.error('Error fetching static stats:', err);
                setError('Failed to load overview stats. Please refresh the page.');
                // We don't set loading to false here, as the chart fetch might still be running.
            }
        };

        fetchStaticData();
    }, [doctorId]); // This dependency array ensures it only runs when `doctorId` changes.

    const fetchChartData = useCallback(async (dateRange, customRange) => {
        if (!doctorId) return;

        setLoading(true);
        // We only clear errors related to the chart, not a potential static-data error.
        if (!error?.includes('overview')) setError(null); 
        
        try {
            const chartParams = {
                range: dateRange,
                ...(dateRange === 'custom' && customRange.startDate && {
                    startDate: customRange.startDate,
                    endDate: customRange.endDate
                })
            };
            const response = await axios.get(
                `/api/payments/doctor/${doctorId}/revenue-chart`, 
                { params: chartParams }
            );
            setChartData(response.data);
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError(err.response?.data?.error || 'Failed to load chart data.');
        } finally {
            setLoading(false);
        }
    }, [doctorId, error]);

    return {
        revenueStats,
        chartData,
        loading,
        error,
        fetchChartData
    };
}

export default useRevenueData;
