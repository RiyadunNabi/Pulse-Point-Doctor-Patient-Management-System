// client/src/components/PatientDashboard/DepartmentsSection/DepartmentsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Star } from 'lucide-react';
import DashboardNavigation from '../Navigation/DashboardNavigation';
import DepartmentsFilters from './DepartmentsFilters';

const DepartmentsPage = ({ user, onLogout }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '' });
  const navigate = useNavigate();

  const fetchDepartments = async (filterParams = filters) => {
    try {
      // const response = await axios.get(
      //   `/api/departments/stats?${params.toString()}`   // Note the backticks (`), not single quotes (')
      // );
      const response = await axios.get('/api/departments/stats', {
        params: { search: filterParams.search }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDepartmentClick = (departmentId) => {
    navigate(`/doctors?department=${departmentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <DashboardNavigation
        user={user}
        activeTab="departments"
        onTabClick={(tab) => {
          if (tab === 'dashboard') navigate('/dashboard');
          else if (tab === 'doctors') navigate('/doctors');
        }}
        notifications={0}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">



            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Medical Departments</h1>
              <p className="text-slate-600 mt-1">
                Explore our specialized medical departments and find the right care for you
              </p>
            </div>
          </div>
        </div>


        {/* Filters */}
        <DepartmentsFilters
          filters={filters}
          onFilterChange={(newF) => {
            setFilters(newF);
            setLoading(true);
            fetchDepartments(newF);
          }}
        />


        {/* Departments Grid */}
        {loading ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading departments...</p>
            </div>
          </div>
        ) : departments.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Departments Available</h3>
              <p className="text-slate-600">There are currently no medical departments available.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <DepartmentCard
                key={department.department_id}
                department={department}
                onClick={() => handleDepartmentClick(department.department_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DepartmentCard = ({ department, onClick }) => {
  const {
    department_name,
    description,
    doctor_count,
    avg_department_rating,
    avg_consultation_fee,
    min_consultation_fee,
    max_consultation_fee
  } = department;

  return (
    <div
      onClick={onClick}
      className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800 group-hover:text-sky-600 transition-colors">
                {department_name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>{doctor_count} {doctor_count === 1 ? 'Doctor' : 'Doctors'}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          {avg_department_rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-slate-700">
                {avg_department_rating}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Stats */}
        <div className="space-y-3">
          {/* Fee Range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <IndianRupee className="w-4 h-4 text-green-600" /> */}
              <span className="w-4 h-4 text-green-600 text-lg">৳</span>
              <span className="text-sm text-slate-600">Consultation Fee</span>
            </div>
            <div className="text-sm font-medium text-slate-800">
              {min_consultation_fee === max_consultation_fee
                ? `৳${min_consultation_fee}`
                : `৳${min_consultation_fee} - ৳${max_consultation_fee}`
              }
            </div>
          </div>

          {/* Average Fee */}
          {avg_consultation_fee && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Average Fee</span>
              <span className="text-sm font-medium text-slate-800">
                ৳{avg_consultation_fee}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105">
            View Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
