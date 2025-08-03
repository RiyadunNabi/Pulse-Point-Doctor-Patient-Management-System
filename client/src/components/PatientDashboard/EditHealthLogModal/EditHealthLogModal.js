import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../shared/Modal';
import HealthLogForm from './HealthLogForm';

function EditHealthLogModal({ isOpen, onClose, patientId, onUpdate, existingLog = null }) {
  const [formData, setFormData] = useState({
    weight: '',
    systolic: '',
    diastolic: '',
    heart_rate: '',
    blood_sugar: '',
    sleep_hours: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Only require all fields except notes
  const requiredFields = ['weight', 'systolic', 'diastolic', 'heart_rate', 'blood_sugar', 'sleep_hours'];
  const isFormValid = requiredFields.every(field => formData[field] !== '');

  // Populate form fields when modal opens or existing log changes
  useEffect(() => {
    if (isOpen) {
      if (existingLog) {
        console.log('Populating form with existing health log:', existingLog);
        setFormData({
          weight: existingLog.weight || '',
          systolic: existingLog.systolic || '',
          diastolic: existingLog.diastolic || '',
          heart_rate: existingLog.heart_rate || '',
          blood_sugar: existingLog.blood_sugar || '',
          sleep_hours: existingLog.sleep_hours || '',
          notes: existingLog.notes || ''
        });
      } else {
        // Reset form for new entry
        setFormData({
          weight: '',
          systolic: '',
          diastolic: '',
          heart_rate: '',
          blood_sugar: '',
          sleep_hours: '',
          notes: ''
        });
      }
    }
  }, [isOpen, existingLog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent submission if required fields are missing
    if (!isFormValid) {
      setError('Please complete all required fields before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    if (!patientId) {
      setError('Patient information is not available. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    console.log('=== HEALTH LOG UPDATE DEBUG ===');
    console.log('Patient ID:', patientId);
    console.log('Form data being sent:', formData);
    console.log('Is updating existing log:', !!existingLog);

    try {
      let response;

      const payload = {
        ...formData,
        patient_id: patientId,
        notes: formData.notes || null
      };
      
      if (existingLog) {
        // Update existing health log
        response = await axios.patch(`/api/health-logs/${existingLog.log_id}`, payload);
        console.log('Health log updated:', response.data);
        setSuccess('Health log updated successfully!');
      } else {
        // Create new health log
        // const logData = {
        //   ...formData,
        //   patient_id: patientId
        // };
        response = await axios.post('/api/health-logs', payload);
        console.log('Health log created:', response.data);
        setSuccess('Health log added successfully!');
      }
      
      onUpdate(response.data);
      
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Health log update error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 404) {
        setError('Health log not found. Please refresh and try again.');
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.details || 'Please try again.'}`);
      } else {
        setError(`Failed to save health log: ${err.response?.data?.error || err.message}`);
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={existingLog ? "Update Health Log" : "Add New Health Log"} 
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <HealthLogForm 
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
                <span>{existingLog ? 'Updating...' : 'Adding...'}</span>
              </div>
            ) : (
              existingLog ? 'Update Log' : 'Add Log'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditHealthLogModal;
