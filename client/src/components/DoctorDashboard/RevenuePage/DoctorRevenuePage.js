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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <DoctorNavigation user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Revenue Dashboard</h1>
          <p className="text-slate-600 mt-2">Track your earnings and financial performance</p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8">
          <DateRangeFilter
            selectedRange={dateRange}
            customRange={customDateRange}
            onRangeChange={handleDateRangeChange}
          />
        </div>

        {/* Revenue Stats Cards */}
        <div className="mb-8">
          <RevenueStatsCards stats={revenueStats} />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart 
              data={chartData} 
              timeFilter={dateRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorRevenuePage;
