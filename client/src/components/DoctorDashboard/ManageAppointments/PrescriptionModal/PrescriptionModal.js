import React from 'react';
import Modal from '../../../shared/Modal'; // Correct path
import PrescriptionForm from './PrescriptionForm';

const PrescriptionModal = ({ isOpen, onClose, appointment }) => {
    if (!isOpen) {
        return null;
    }

    // This console log is still very important.
    // Check your browser's developer console to see what the 'appointment' object looks like.
    console.log('Data received by PrescriptionModal:', appointment);

    if (!appointment) {
        return (
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                title="Error" 
                size="md"
            >
                <div className="text-center py-8">
                    <p className="text-slate-500">Appointment information is missing.</p>
                </div>
            </Modal>
        );
    }

    // This logic correctly extracts the name if the data is present.
    const patientName = `${appointment.patient_first_name || ''} ${appointment.patient_last_name || ''}`.trim();

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Create Prescription" 
            // --- THIS IS THE FIX ---
            // We use a ternary operator to check if patientName exists.
            // If it does, we show the name. If not, we show a fallback message.
            subtitle={patientName ? `Patient: ${patientName}` : 'Loading patient details...'}
            size="md"
        >
            <PrescriptionForm 
                appointment={appointment} 
                onClose={onClose} 
            />
        </Modal>
    );
};

export default PrescriptionModal;
