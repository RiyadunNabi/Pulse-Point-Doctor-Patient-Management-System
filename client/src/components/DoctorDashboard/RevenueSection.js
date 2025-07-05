import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function RevenueSection({ revenueData, doctorId }) {
    const [timeFilter, setTimeFilter] = useState('month'); // day, month, year
    const [revenueStats, setRevenueStats] = useState({
        today: 0,
        thisMonth: 0,
        thisYear: 0,
        totalEarnings: 0
    });

    const timeFilters = [
        { id: 'day', label: 'Daily', period: 'Last 30 Days' },
        { id: 'month', label: 'Monthly', period: 'Last 12 Months' },
        { id: 'year', label: 'Yearly', period: 'Last 5 Years' }
    ];

    useEffect(() => {
        // Calculate revenue statistics from revenueData
        if (revenueData) {
            // This would be calculated based on your actual revenue data structure
            setRevenueStats({
                today: revenueData.today || 0,
                thisMonth: revenueData.thisMonth || 0,
                thisYear: revenueData.thisYear || 0,
                totalEarnings: revenueData.total || 0
            });
        }
    }, [revenueData]);

    // Generate chart data based on time filter
    const getChartData = () => {
        // This would be populated with actual data from your API
        const mockData = {
            day: {
                labels: Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 100)
            },
            month: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [1200, 1500, 1800, 1400, 1600, 2000, 1900, 2200, 1700, 1900, 2100, 2300]
            },
            year: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                data: [15000, 18000, 22000, 25000, 28000]
            }
        };

        const currentData = mockData[timeFilter];

        return {
            labels: currentData.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: currentData.data,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#22d3ee',
                    pointBorderColor: '#38bdf8',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#38bdf8',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Revenue: $${context.parsed.y.toLocaleString()}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                },
                ticks: {
                    color: '#64748b',
                },
            },
            y: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                },
                ticks: {
                    color: '#64748b',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                },
            },
        },
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Revenue Analytics</h3>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {timeFilters.map(filter => (
                            <option key={filter.id} value={filter.id}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Today</p>
                            <p className="text-xl font-bold text-green-600">
                                ${revenueStats.today.toLocaleString()}
                            </p>
                        </div>
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">This Month</p>
                            <p className="text-xl font-bold text-blue-600">
                                ${revenueStats.thisMonth.toLocaleString()}
                            </p>
                        </div>
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">This Year</p>
                            <p className="text-xl font-bold text-purple-600">
                                ${revenueStats.thisYear.toLocaleString()}
                            </p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total</p>
                            <p className="text-xl font-bold text-cyan-600">
                                ${revenueStats.totalEarnings.toLocaleString()}
                            </p>
                        </div>
                        <DollarSign className="w-6 h-6 text-cyan-600" />
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="h-64">
                <Line data={getChartData()} options={chartOptions} />
            </div>

            {/* Period Information */}
            <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">
                    {timeFilters.find(f => f.id === timeFilter)?.period}
                </p>
            </div>
        </div>
    );
}

export default RevenueSection;
