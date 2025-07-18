// import React, { useState } from 'react';
// import { Save, AlertCircle, CheckCircle } from 'lucide-react';
// import DrugSelector from './DrugSelector';
// import InvestigationSelector from './InvestigationSelector';
// import FileUpload from './FileUpload';
// import { usePrescriptionData } from './hooks/usePrescriptionData';
// import { useFileUpload } from './hooks/useFileUpload';

// const PrescriptionForm = ({ appointment, onClose }) => {
//     const [formData, setFormData] = useState({
//         appointment_id: appointment.appointment_id,
//         diagnosis: '',
//         instructions: '',
//         other_drugs: '',
//         drugs: [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
//         investigations: [{ investigation_id: '', notes: '' }]
//     });

//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     const { createPrescription } = usePrescriptionData();
//     const { uploadPrescriptionFiles } = useFileUpload();

//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleDrugsChange = (drugs) => {
//         setFormData(prev => ({
//             ...prev,
//             drugs: drugs
//         }));
//     };

//     const handleInvestigationsChange = (investigations) => {
//         setFormData(prev => ({
//             ...prev,
//             investigations: investigations
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError('');
//         setSuccessMessage('');

//         try {
//             // Filter out empty drugs and investigations
//             const validDrugs = formData.drugs.filter(drug => drug.drug_id);
//             const validInvestigations = formData.investigations.filter(inv => inv.investigation_id);

//             const prescriptionData = {
//                 ...formData,
//                 drugs: validDrugs,
//                 investigations: validInvestigations
//             };

//             const result = await createPrescription(prescriptionData);
            
//             if (result.success) {
//                 const prescriptionId = result.data.prescription_id;
                
//                 // Handle file uploads if any
//                 if (uploadedFiles.length > 0) {
//                     const fileResult = await uploadPrescriptionFiles(prescriptionId, uploadedFiles);
//                     if (!fileResult.success) {
//                         setError('Prescription created but failed to upload files: ' + fileResult.error);
//                         return;
//                     }
//                 }
                
//                 setSuccessMessage('Prescription created successfully!');
                
//                 // Close modal after a brief delay to show success message
//                 setTimeout(() => {
//                     onClose();
//                 }, 1500);
//             } else {
//                 setError(result.error || 'Failed to create prescription');
//             }
//         } catch (err) {
//             setError('An error occurred while creating the prescription');
//             console.error('Error:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//                     <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
//                     <div className="text-red-700 text-sm">{error}</div>
//                 </div>
//             )}

//             {successMessage && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
//                     <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                     <div className="text-green-700 text-sm">{successMessage}</div>
//                 </div>
//             )}

//             {/* Diagnosis */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Diagnosis <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                     value={formData.diagnosis}
//                     onChange={(e) => handleInputChange('diagnosis', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
//                     rows={3}
//                     placeholder="Enter patient diagnosis..."
//                     required
//                 />
//             </div>

//             {/* Instructions */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Instructions
//                 </label>
//                 <textarea
//                     value={formData.instructions}
//                     onChange={(e) => handleInputChange('instructions', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
//                     rows={3}
//                     placeholder="Enter instructions for the patient..."
//                 />
//             </div>

//             {/* Other Drugs */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Other Drugs/Notes
//                 </label>
//                 <textarea
//                     value={formData.other_drugs}
//                     onChange={(e) => handleInputChange('other_drugs', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
//                     rows={2}
//                     placeholder="Any additional drugs or notes..."
//                 />
//             </div>

//             {/* Drugs Section */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Prescribed Drugs
//                 </label>
//                 <DrugSelector
//                     drugs={formData.drugs}
//                     onChange={handleDrugsChange}
//                 />
//             </div>

//             {/* Investigations Section */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Investigations/Tests
//                 </label>
//                 <InvestigationSelector
//                     investigations={formData.investigations}
//                     onChange={handleInvestigationsChange}
//                 />
//             </div>

//             {/* File Upload */}
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Upload Prescription Files
//                 </label>
//                 <FileUpload
//                     files={uploadedFiles}
//                     onChange={setUploadedFiles}
//                 />
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-3 pt-4 border-t">
//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={isSubmitting || !formData.diagnosis || successMessage}
//                     className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
//                 >
//                     <Save className="w-4 h-4" />
//                     <span>{isSubmitting ? 'Creating...' : 'Create Prescription'}</span>
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default PrescriptionForm;



import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, User, Stethoscope, Beaker, Pill, UploadCloud } from 'lucide-react';
import DrugSelector from './DrugSelector';
import InvestigationSelector from './InvestigationSelector';
import FileUpload from './FileUpload';
import { usePrescriptionData } from './hooks/usePrescriptionData';
import { useFileUpload } from './hooks/useFileUpload';

const PrescriptionForm = ({ appointment, onClose }) => {
    // 'follow_up_date' has been removed from the initial state
    const [formData, setFormData] = useState({
        appointment_id: appointment.appointment_id,
        diagnosis: '',
        instructions: '',
        drugs: [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
        investigations: [{ investigation_id: '', notes: '' }]
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { createPrescription } = usePrescriptionData();
    const { uploadPrescriptionFiles } = useFileUpload();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDrugsChange = (drugs) => {
        setFormData(prev => ({ ...prev, drugs }));
    };

    const handleInvestigationsChange = (investigations) => {
        setFormData(prev => ({ ...prev, investigations }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            // Submission logic is simplified without follow_up_date
            const prescriptionData = {
                ...formData,
                drugs: formData.drugs.filter(drug => drug.drug_id),
                investigations: formData.investigations.filter(inv => inv.investigation_id),
            };

            const result = await createPrescription(prescriptionData);
            
            if (result.success) {
                const prescriptionId = result.data.prescription_id;
                
                if (uploadedFiles.length > 0) {
                    await uploadPrescriptionFiles(prescriptionId, uploadedFiles);
                }
                
                setSuccessMessage('Prescription created successfully!');
                setTimeout(() => onClose(), 1500);
            } else {
                setError(result.error || 'Failed to create prescription');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="space-y-4 animate-fade-in" // Reduced vertical spacing
        >
            {/* Patient Information Header */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-full shadow-md">
                        <User className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">
                            {appointment.patient_first_name} {appointment.patient_last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                            <span>ID: {appointment.patient_id}</span>
                            <span>|</span>
                            <span>Age: {new Date().getFullYear() - new Date(appointment.date_of_birth).getFullYear()}</span>
                            <span>|</span>
                            <span>Gender: {appointment.patient_gender}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
            )}
            
            {/* Core Prescription Details Section */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-cyan-500"/>Diagnosis & Instructions</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis <span className="text-red-500">*</span></label>
                        <textarea value={formData.diagnosis} onChange={(e) => handleInputChange('diagnosis', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" rows={2} placeholder="e.g., Acute Bronchitis" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">General Instructions</label>
                        <textarea value={formData.instructions} onChange={(e) => handleInputChange('instructions', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" rows={2} placeholder="e.g., Take rest, stay hydrated" />
                    </div>
                </div>
            </div>
            
            {/* Medications Section - More Compact */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Pill className="w-4 h-4 mr-2 text-cyan-500"/>Medications</h3>
                <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
            </div>

            {/* Investigations Section - More Compact */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Beaker className="w-4 h-4 mr-2 text-cyan-500"/>Investigations</h3>
                <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
            </div>
            
            {/* File Upload Section - Full Width */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><UploadCloud className="w-4 h-4 mr-2 text-cyan-500"/>Upload Files</h3>
                <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 mt-4">
                <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || !formData.diagnosis || successMessage} className="px-5 py-2 text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105">
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Prescription'}</span>
                </button>
            </div>
        </form>
    );
};

export default PrescriptionForm;
