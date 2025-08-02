import React, { useState, useEffect } from 'react';
import DoctorNavigation from '../shared/DoctorNavigation';
import RevenueStatsCards from './components/RevenueStatsCards';
import RevenueChart from './components/RevenueChart';
import DateRangeFilter from './components/DateRangeFilter';
import useRevenueData from './hooks/useRevenueData';
import DynamicTotalCard from './components/DynamicTotalCard';

function DoctorRevenuePage({ user, onLogout }) {
    // All your state and logic hooks are perfect. No changes needed here.
    const [dateRange, setDateRange] = useState('month');
    const [customDateRange, setCustomDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const {
        revenueStats,
        chartData,
        loading,
        error,
        fetchChartData
    } = useRevenueData(user?.doctor_id);

    useEffect(() => {
        if (user?.doctor_id) {
            fetchChartData(dateRange, customDateRange);
        }
    }, [user?.doctor_id, dateRange, customDateRange, fetchChartData]);

    const handleDateRangeChange = (range, customRange = null) => {
        setDateRange(range);
        if (range === 'custom' && customRange) {
            setCustomDateRange(customRange);
        }
    };
    
    const getDynamicCardLabel = () => {
        switch (dateRange) {
            case 'today': return "Total for Today";
            case 'week': return "Total for Last 7 Days";
            case 'month': return "Total for This Month";
            case 'year': return "Total for This Year";
            case 'last_5_years': return "Total for Last 5 Years";
            case 'custom':
                if (customDateRange.startDate && customDateRange.endDate) {
                    return `Total from ${customDateRange.startDate} to ${customDateRange.endDate}`;
                }
                return "Total for Custom Range";
            default: return "Total for Selected Period";
        }
    };
    
    if (loading && !chartData.labels) {
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

    // --- FINAL JSX LAYOUT ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-50">
            {/* 1. Added decorative background elements for consistency */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
            </div>

            <DoctorNavigation user={user} onLogout={onLogout} />
            
            {/* 2. Replaced <main> with the standard content wrapper for consistency */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Revenue</h1>
                            <p className="text-slate-600 mt-1">
                                Track and analyze your earnings with detailed charts and stats
                            </p>
                        </div>
                    </div>
                </div>

                {/* Static Cards */}
                <div className="mb-6">
                    <RevenueStatsCards stats={revenueStats} />
                </div>

                {/* Main Chart Card - Using consistent card styling */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h3 className="text-xl font-bold text-slate-800 shrink-0">Revenue Analytics</h3>
                        <DateRangeFilter
                            selectedRange={dateRange}
                            customRange={customDateRange}
                            onRangeChange={handleDateRangeChange}
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    
                    <>
                        <DynamicTotalCard 
                            label={getDynamicCardLabel()}
                            total={chartData?.total || 0}
                        />
                        <RevenueChart data={chartData} timeFilter={dateRange} />
                    </>
                </div>
            </div>
        </div>
    );
}

export default DoctorRevenuePage;
