//components/PatientDashboard/AppointmentModal/AppointmentModal.js
import React, { useState } from 'react';
import Modal from '../../shared/Modal';               // your existing generic modal
import { useAppointment } from '../hooks/useAppointment';
import DatePicker from 'react-datepicker';           // yarn add react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentModal = ({ open, onClose, doctor, patientId, onBooked }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason]             = useState('');
  const { book, loading, error, success } = useAppointment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    await book({
      doctor_id: doctor.doctor_id,
      patient_id: patientId,
      date: selectedDate.toISOString().slice(0,10), // yyyy-mm-dd
      reason
    });

    if (!error) {
      onBooked(success);    // let parent refresh lists etc.
      onClose();
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Book Appointment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Doctor summary */}
        <div className="text-slate-700">
          <p className="font-semibold">Dr. {doctor.first_name} {doctor.last_name}</p>
          <p className="text-sm">{doctor.department_name}</p>
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Select date</label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Reason (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Reason (optional)</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            rows={3}
            value={reason}
            onChange={(e)=>setReason(e.target.value)}
          />
        </div>

        {/* Errors */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !selectedDate}
          className="w-full py-2 bg-gradient-to-r from-sky-600 to-cyan-600
                     text-white rounded-lg disabled:opacity-50">
          {loading ? 'Booking…' : 'Confirm Appointment'}
        </button>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
