// client/src/components/DoctorDashboard/RevenuePage/components/RevenueStatsCards.js
import React from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

function RevenueStatsCards({ stats }) {
  const cards = [
    {
      title: 'Today',
      value: stats?.today || 0,
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      change: stats?.todayChange || 0
    },
    {
      title: 'This Week',
      value: stats?.thisWeek || 0,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      change: stats?.weekChange || 0
    },
    {
      title: 'This Month',
      value: stats?.thisMonth || 0,
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      change: stats?.monthChange || 0
    },
    {
      title: 'This Year',
      value: stats?.thisYear || 0,
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      change: stats?.yearChange || 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        
        return (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
                <span>{Math.abs(card.change)}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-800">
                ${card.value.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RevenueStatsCards;
