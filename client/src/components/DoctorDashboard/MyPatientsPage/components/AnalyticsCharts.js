import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const AnalyticsCharts = ({ doctorId }) => {
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('daily');

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!doctorId) return;

            try {
                setLoading(true);
                const [dailyResponse, monthlyResponse] = await Promise.all([
                    axios.get(`/api/doctor-patients/doctor/${doctorId}/daily-analytics?days=7`),
                    axios.get(`/api/doctor-patients/doctor/${doctorId}/monthly-analytics?months=12`)
                ]);

                // Format daily data
                const formattedDailyData = dailyResponse.data.map(item => ({
                    ...item,
                    date: new Date(item.appointment_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    appointments: parseInt(item.appointment_count)
                }));

                // Format monthly data
                const formattedMonthlyData = monthlyResponse.data.map(item => ({
                    ...item,
                    month: new Date(item.appointment_month).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                    }),
                    appointments: parseInt(item.appointment_count)
                }));

                setDailyData(formattedDailyData);
                setMonthlyData(formattedMonthlyData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [doctorId]);

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Appointment Analytics</h3>
                            <p className="text-sm text-slate-600">Track your appointment patterns over time</p>
                        </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'daily'
                                    ? 'bg-white text-slate-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === 'monthly'
                                    ? 'bg-white text-slate-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Last 12 Months
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
                {activeTab === 'daily' ? (
                    <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-4">Daily Appointments (Last 7 Days)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <YAxis 
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar 
                                    dataKey="appointments" 
                                    fill="url(#gradientDaily)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <defs>
                                    <linearGradient id="gradientDaily" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-4">Monthly Appointments (Last 12 Months)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <YAxis 
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="appointments" 
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsCharts;
