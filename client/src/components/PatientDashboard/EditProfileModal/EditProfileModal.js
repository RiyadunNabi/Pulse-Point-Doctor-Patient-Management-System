import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../shared/Modal';
import ProfileForm from './ProfileForm';
import ProfilePhotoSection from './ProfilePhotoSection';

function EditProfileModal({ isOpen, onClose, patient, onUpdate }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone_no: '',
    address: '',
    blood_group: '',
    health_condition: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Populate form fields when patient changes
  useEffect(() => {
    if (isOpen && patient) {
      console.log('Populating form with patient data:', patient);
      setFormData({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        gender: patient.gender || '',
        date_of_birth: patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '',
        phone_no: patient.phone_no || '',
        address: patient.address || '',
        blood_group: patient.blood_group || '',
        health_condition: patient.health_condition || ''
      });
    }
  }, [isOpen, patient]);

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

    // ✅ Add null safety check for patient
    if (!patient || !patient.patient_id) {
      setError('Patient information is not available. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    console.log('=== FRONTEND UPDATE DEBUG ===');
    console.log('Patient object:', patient);
    console.log('Patient ID:', patient.patient_id);
    console.log('Form data being sent:', formData);
    console.log('API URL:', `/api/patients/${patient.patient_id}`);

    try {
      const response = await axios.patch(`/api/patients/${patient.patient_id}`, formData);
      
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
        setError('Patient not found. Please refresh and try again.');
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

  // ✅ Add safety check before rendering
  if (!patient) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title="Edit Profile" 
        size="lg"
      >
        <div className="text-center py-8">
          <p className="text-slate-500">Loading patient information...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Profile" 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfilePhotoSection />

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

        <ProfileForm 
          formData={formData} 
          onChange={handleInputChange}
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

export default EditProfileModal;
