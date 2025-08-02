// client/src/components/DoctorDashboard/RevenuePage/DoctorRevenuePage.js
import React, { useState, useEffect } from 'react';
import DoctorNavigation from '../shared/DoctorNavigation';
import RevenueStatsCards from './components/RevenueStatsCards';
import RevenueChart from './components/RevenueChart';
import DateRangeFilter from './components/DateRangeFilter';
import useRevenueData from './hooks/useRevenueData';

function DoctorRevenuePage({ user, onLogout }) {
  const [dateRange, setDateRange] = useState('month'); // today, week, month, year, custom
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const {
    revenueStats,
    chartData,
    loading,
    error,
    fetchRevenueData
  } = useRevenueData(user?.doctor_id);

  useEffect(() => {
    if (user?.doctor_id) {
      fetchRevenueData(dateRange, customDateRange);
    }
  }, [user?.doctor_id, dateRange, customDateRange]);

  const handleDateRangeChange = (range, customRange = null) => {
    setDateRange(range);
    if (customRange) {
      setCustomDateRange(customRange);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <DoctorNavigation user={user} onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="text-slate-700 font-medium">Loading revenue data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <DoctorNavigation user={user} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
        <DoctorNavigation user={user} onLogout={onLogout} />
        <main className="flex-1 bg-sky-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Use the new design's container and title */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Revenue Analytics</h3>
                        {/* The DateRangeFilter will go here */}
                        <DateRangeFilter
                            selectedRange={dateRange}
                            customRange={customDateRange}
                            onRangeChange={handleDateRangeChange}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center p-8">Loading revenue data...</div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-500">{error}</div>
                    ) : (
                        <>
                            {/* Pass both revenueStats and chartData to the cards component */}
                            <RevenueStatsCards stats={revenueStats} chartData={chartData} />
                            <RevenueChart data={chartData} timeFilter={dateRange} />
                        </>
                    )}
                </div>
            </div>
        </main>
    </>
);
};
export default DoctorRevenuePage;
