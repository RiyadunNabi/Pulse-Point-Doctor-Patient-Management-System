import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GraphTabs from './GraphTabs';
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

const analyzeTrend = (data) => {
  if (data.length < 2) return { trend: 'stable', message: 'Need more data for analysis' };
  
  const recent = data.slice(-5);
  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(change) < 2) {
    return { trend: 'stable', message: 'Bravo! Your levels are stable and well-controlled.' };
  } else if (change > 2) {
    return { trend: 'increasing', message: 'Alert: Trending upward. Consider consulting your doctor.' };
  } else {
    return { trend: 'decreasing', message: 'Good news: Levels are decreasing steadily.' };
  }
};

function GraphSection({ healthLogs }) {
  const [activeTab, setActiveTab] = useState('weight');

  const chartTabs = [
    { id: 'weight', label: 'Weight', unit: 'kg' },
    { id: 'bp', label: 'Blood Pressure', unit: 'mmHg' },
    { id: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
    { id: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { id: 'sleep', label: 'Sleep', unit: 'hours' },
  ];

  const getChartData = (metric) => {
    const last14Logs = healthLogs.slice(0, 14).reverse();
    
    let data, labels;
    
    switch (metric) {
      case 'weight':
        data = last14Logs.map(log => log.weight).filter(val => val !== null);
        break;
      case 'bp':
        data = last14Logs.map(log => log.systolic).filter(val => val !== null);
        break;
      case 'heart_rate':
        data = last14Logs.map(log => log.heart_rate).filter(val => val !== null);
        break;
      case 'blood_sugar':
        data = last14Logs.map(log => log.blood_sugar).filter(val => val !== null);
        break;
      case 'sleep':
        data = last14Logs.map(log => log.sleep_hours).filter(val => val !== null);
        break;
      default:
        data = [];
    }
    
    labels = last14Logs.slice(0, data.length).map(log => 
      new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    return {
      labels,
      datasets: [
        {
          label: chartTabs.find(tab => tab.id === metric)?.label || metric,
          data,
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
        },
      },
    },
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Health Trends</h3>
      
      {/* Chart Tabs */}
      <GraphTabs 
        tabs={chartTabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Chart */}
      <div className="h-64 mb-4">
        {healthLogs.length > 0 ? (
          <Line data={getChartData(activeTab)} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No data to display</p>
            </div>
          </div>
        )}
      </div>

      {/* Trend Analysis */}
      {healthLogs.length > 1 && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            {(() => {
              const currentTab = chartTabs.find(tab => tab.id === activeTab);
              const data = getChartData(activeTab).datasets[0].data;
              const analysis = analyzeTrend(data);
              
              return (
                <>
                  {analysis.trend === 'increasing' && <TrendingUp className="w-5 h-5 text-red-500" />}
                  {analysis.trend === 'decreasing' && <TrendingDown className="w-5 h-5 text-green-500" />}
                  {analysis.trend === 'stable' && <Minus className="w-5 h-5 text-blue-500" />}
                  <span className="font-medium text-slate-700">
                    {currentTab?.label} Trend Analysis
                  </span>
                </>
              );
            })()}
          </div>
          <p className="text-sm text-slate-600">
            {(() => {
              const data = getChartData(activeTab).datasets[0].data;
              return analyzeTrend(data).message;
            })()}
          </p>
        </div>
      )}
    </div>
  );
}

export default GraphSection;
