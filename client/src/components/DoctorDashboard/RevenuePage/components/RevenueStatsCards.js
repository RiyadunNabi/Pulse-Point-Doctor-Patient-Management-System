// client/src/components/DoctorDashboard/RevenuePage/components/RevenueStatsCards.js
import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

// The component now accepts `chartData` to get the total earnings
function RevenueStatsCards({ stats, chartData }) {
    const revenueStats = {
        today: stats?.today || 0,
        thisMonth: stats?.thisMonth || 0,
        thisYear: stats?.thisYear || 0,
        // The new design has a "Total" card, which we can get from the chartData object
        totalEarnings: chartData?.total || 0
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1: Today */}
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

            {/* Card 2: This Month */}
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

            {/* Card 3: This Year */}
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
            
            {/* Card 4: Total Earnings */}
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
    );
}

export default RevenueStatsCards;
