import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../shared/Modal';
import DoctorProfileForm from './DoctorProfileForm';
import DoctorProfilePhotoSection from './DoctorProfilePhotoSection';

function EditDoctorProfileModal({ isOpen, onClose, doctor, onUpdate }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    bio: '',
    consultation_fee: '',
    license_no: '',
    phone_no: '',
    address: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  // Populate form fields when doctor changes
  useEffect(() => {
    if (isOpen && doctor) {
      console.log('Populating form with doctor data:', doctor);
      setFormData({
        first_name: doctor.first_name || '',
        last_name: doctor.last_name || '',
        gender: doctor.gender || '',
        bio: doctor.bio || '',
        consultation_fee: doctor.consultation_fee || '',
        license_no: doctor.license_no || '',
        phone_no: doctor.phone_no || '',
        address: doctor.address || '',
        department_id: doctor.department_id || ''
      });
    }
  }, [isOpen, doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Add null safety check for doctor
    if (!doctor || !doctor.doctor_id) {
      setError('Doctor information is not available. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    // Debug logging
    console.log('=== DOCTOR DATA DEBUG (BEFORE UPDATE) ===');
    console.log('Raw doctor object:', doctor);
    console.log('Doctor ID value:', doctor?.doctor_id);
    console.log('Doctor ID type:', typeof doctor?.doctor_id);
    console.log('Doctor ID as string:', String(doctor?.doctor_id));
    console.log('Doctor ID JSON:', JSON.stringify(doctor?.doctor_id));

    console.log('=== FRONTEND UPDATE DEBUG ===');
    console.log('Doctor object:', doctor);
    console.log('Doctor ID:', doctor.doctor_id);
    console.log('Form data being sent:', formData);
    console.log('API URL:', `/api/doctors/${doctor.doctor_id}`);

    try {
      const response = await axios.patch(`/api/doctors/${doctor.doctor_id}`, formData);
      
      console.log('Update response:', response.data);
      setSuccess('Profile updated successfully!');
      onUpdate(response.data);
      
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Frontend update error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // More specific error messages
      if (err.response?.status === 404) {
        setError('Doctor not found. Please refresh and try again.');
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.details || 'Please try again.'}`);
      } else {
        setError(`Failed to update profile: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  // Add safety check before rendering
  if (!doctor) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title="Edit Doctor Profile" 
        size="lg"
      >
        <div className="text-center py-8">
          <p className="text-slate-500">Loading doctor information...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Doctor Profile" 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <DoctorProfilePhotoSection />

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}

        <DoctorProfileForm 
          formData={formData} 
          onChange={handleInputChange}
          departments={departments}
            doctor={doctor}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditDoctorProfileModal;
