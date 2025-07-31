// client/src/components/PatientDashboard/DoctorsSection/DoctorsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../Navigation/DashboardNavigation';
import DoctorsFilters from './DoctorsFilters';
import DoctorsList from './DoctorsList';
import DoctorsPagination from './DoctorsPagination';

const DoctorsPage = ({ user, onLogout }) => {
  // Add default empty arrays to prevent undefined errors
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter states with safe defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    minFee: searchParams.get('minFee') || '',
    maxFee: searchParams.get('maxFee') || '',
    minRating: searchParams.get('minRating') || '',
    gender: searchParams.get('gender') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    sortOrder: searchParams.get('sortOrder') || 'asc',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch doctors with filters
  const fetchDoctors = async (filterParams = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/doctors?${params.toString()}`);
      
      // Handle different response formats
      if (response.data.doctors) {
        // New format with pagination
        setDoctors(response.data.doctors || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1
        });
      } else {
        // Old format - array of doctors
        setDoctors(response.data || []);
        setPagination({
          total: response.data?.length || 0,
          page: 1,
          limit: 12,
          totalPages: 1
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments for filter dropdown
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/doctors/departments');
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    navigate(`/doctors?${params.toString()}`, { replace: true });
    fetchDoctors(updatedFilters);
  };

  // Handle page change
  const handlePageChange = (page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    navigate(`/doctors?${params.toString()}`, { replace: true });
    fetchDoctors(updatedFilters);
  };

  // Initial load
  useEffect(() => {
    fetchDoctors(filters);
    fetchDepartments();
  }, []);

  // Department filter from URL (when coming from departments page)
  useEffect(() => {
    const departmentId = searchParams.get('department');
    if (departmentId && departmentId !== filters.department) {
      setFilters(prev => ({ ...prev, department: departmentId }));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <DashboardNavigation
        user={user}
        activeTab="doctors"
        onTabClick={(tab) => {
          if (tab === 'dashboard') navigate('/dashboard');
          else if (tab === 'departments') navigate('/departments');
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
              <h1 className="text-3xl font-bold text-slate-800">Find Doctors</h1>
              <p className="text-slate-600 mt-1">
                Search and book appointments with healthcare professionals
              </p>
            </div>
          </div>
          
          {/* Results summary */}
          <div className="text-sm text-slate-500">
            {loading ? (
              "Loading doctors..."
            ) : (
              `Showing ${doctors.length} of ${pagination.total} doctors`
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <DoctorsFilters
            filters={filters}
            departments={departments}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Doctors List */}
        <DoctorsList
          doctors={doctors}
          loading={loading}
          user={user}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <DoctorsPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;