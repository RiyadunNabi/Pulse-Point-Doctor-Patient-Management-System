// client/src/components/DoctorDashboard/RevenuePage/components/RevenueBreakdown.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, Users, Calendar } from 'lucide-react';

function RevenueBreakdown({ breakdown }) {
  const pieData = [
    { name: 'Consultations', value: breakdown?.consultations || 0, color: '#38bdf8' },
    { name: 'Follow-ups', value: breakdown?.followups || 0, color: '#22d3ee' },
    { name: 'Procedures', value: breakdown?.procedures || 0, color: '#06b6d4' },
    { name: 'Other', value: breakdown?.other || 0, color: '#0891b2' }
  ];

  const stats = [
    {
      title: 'Total Appointments',
      value: breakdown?.totalAppointments || 0,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Avg. per Appointment',
      value: `$${breakdown?.avgPerAppointment || 0}`,
      icon: Activity,
      color: 'text-emerald-600'
    },
    {
      title: 'Active Patients',
      value: breakdown?.activePatients || 0,
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Sources */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Sources</h3>
        
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                ${item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics</h3>
        
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-slate-600">{stat.title}</span>
                </div>
                <span className="font-semibold text-slate-800">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RevenueBreakdown;
