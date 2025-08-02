// client/src/components/DoctorDashboard/RevenuePage/components/RevenueChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
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

function RevenueChart({ data, timeFilter }) {
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

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.values || [],
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

  const getTimeFilterLabel = () => {
    const labels = {
      today: 'Hourly Revenue (Today)',
      week: 'Daily Revenue (Last 7 Days)',
      month: 'Daily Revenue (This Month)',
      year: 'Monthly Revenue (This Year)',
      custom: 'Revenue (Custom Range)'
    };
    return labels[timeFilter] || 'Revenue Trend';
  };

  return (
    <>
        {/* Revenue Chart */}
        <div className="h-64">
            <Line data={chartData} options={chartOptions} />
        </div>

        {/* Period Information */}
        <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
                {getTimeFilterLabel()}
            </p>
        </div>
    </>
);
}

export default RevenueChart;
