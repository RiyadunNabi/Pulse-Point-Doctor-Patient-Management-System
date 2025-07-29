// client/src/components/DoctorDashboard/RevenuePage/hooks/useRevenueData.js
import { useState, useCallback } from 'react';
import axios from 'axios';

function useRevenueData(doctorId) {
  const [revenueStats, setRevenueStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevenueData = useCallback(async (dateRange, customRange) => {
    if (!doctorId) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        range: dateRange,
        ...(dateRange === 'custom' && customRange.startDate && customRange.endDate && {
          startDate: customRange.startDate,
          endDate: customRange.endDate
        })
      };

      // Fetch revenue statistics
      const statsResponse = await axios.get(`/api/payments/doctor/${doctorId}/revenue-stats`, { params });
    //   setRevenueStats(statsResponse.data);
       const s = statsResponse.data;
 setRevenueStats({
   today:        s.today,
   thisWeek:     s.this_week,
   thisMonth:    s.this_month,
   thisYear:     s.this_year,
   todayChange:  s.today_change,
   weekChange:   s.week_change,
   monthChange:  s.month_change,
   yearChange:   s.year_change,
 });

      // Fetch chart data
      const chartResponse = await axios.get(`/api/payments/doctor/${doctorId}/revenue-chart`, { params });
      setChartData(chartResponse.data);

    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err.response?.data?.error || 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  return {
    revenueStats,
    chartData,
    loading,
    error,
    fetchRevenueData
  };
}

export default useRevenueData;
