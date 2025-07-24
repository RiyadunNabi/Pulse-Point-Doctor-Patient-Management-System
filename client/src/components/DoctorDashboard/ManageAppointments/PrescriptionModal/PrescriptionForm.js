import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, User, Stethoscope, Beaker, Pill, UploadCloud, Edit, FileText } from 'lucide-react';
import DrugSelector from './DrugSelector';
import InvestigationSelector from './InvestigationSelector';
import FileUpload from './FileUpload';
import { usePrescriptionData } from './hooks/usePrescriptionData';
import { useFileUpload } from './hooks/useFileUpload';

const PrescriptionForm = ({ appointment, onClose }) => {
    const [formData, setFormData] = useState({
        appointment_id: appointment.appointment_id,
        diagnosis: '',
        instructions: '',
        drugs: [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
        investigations: [{ investigation_id: '', notes: '' }]
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [prescriptionId, setPrescriptionId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { createPrescription, getPrescriptionByAppointmentId, updatePrescription } = usePrescriptionData();
    const { uploadPrescriptionFiles, getPrescriptionFiles } = useFileUpload();

    // Load existing prescription on component mount
    useEffect(() => {
        const loadExistingPrescription = async () => {
            try {
                const result = await getPrescriptionByAppointmentId(appointment.appointment_id);
                
                if (result.success) {
                    // Prescription exists - populate form for editing
                    const prescription = result.data;
                    setIsEditMode(true);
                    setPrescriptionId(prescription.prescription_id);
                    
                    setFormData({
                        appointment_id: appointment.appointment_id,
                        diagnosis: prescription.diagnosis || '',
                        instructions: prescription.instructions || '',
                        drugs: prescription.drugs && prescription.drugs.length > 0 
                            ? prescription.drugs.map(drug => ({
                                drug_id: drug.drug_id,
                                dosages: drug.dosages || '',
                                frequency_per_day: drug.frequency_per_day || 1,
                                duration: drug.duration || '',
                                additional_notes: drug.additional_notes || ''
                            }))
                            : [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
                        investigations: prescription.investigations && prescription.investigations.length > 0
                            ? prescription.investigations.map(inv => ({
                                investigation_id: inv.investigation_id,
                                notes: inv.notes || ''
                            }))
                            : [{ investigation_id: '', notes: '' }]
                    });

                    // Load existing files
                    const filesResult = await getPrescriptionFiles(prescription.prescription_id);
                    if (filesResult.success) {
                        setExistingFiles(filesResult.data);
                    }
                }
            } catch (err) {
                console.error('Error loading prescription:', err);
            } finally {
                setLoading(false);
            }
        };

        loadExistingPrescription();
    }, [appointment.appointment_id]);

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
            const prescriptionData = {
                ...formData,
                drugs: formData.drugs.filter(drug => drug.drug_id),
                investigations: formData.investigations.filter(inv => inv.investigation_id),
            };

            let result;
            let currentPrescriptionId = prescriptionId;

            if (isEditMode) {
                // Update existing prescription
                result = await updatePrescription(prescriptionId, prescriptionData);
            } else {
                // Create new prescription
                result = await createPrescription(prescriptionData);
                if (result.success) {
                    currentPrescriptionId = result.data.prescription_id;
                    setPrescriptionId(currentPrescriptionId);
                    setIsEditMode(true);
                }
            }
            
            if (result.success) {
                // Upload new files if any
                if (uploadedFiles.length > 0) {
                    const uploadResult = await uploadPrescriptionFiles(currentPrescriptionId, uploadedFiles);
                    if (uploadResult.success) {
                        // Refresh existing files list
                        const filesResult = await getPrescriptionFiles(currentPrescriptionId);
                        if (filesResult.success) {
                            setExistingFiles(filesResult.data);
                        }
                        setUploadedFiles([]); // Clear uploaded files
                    }
                }
                
                setSuccessMessage(isEditMode ? 'Prescription updated successfully!' : 'Prescription created successfully!');
                setTimeout(() => onClose(), 1500);
            } else {
                setError(result.error || 'Failed to save prescription');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <span className="ml-3 text-slate-600">Loading prescription...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {/* Header with mode indicator */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    {isEditMode ? (
                        <>
                            <Edit className="w-5 h-5 mr-2 text-blue-500" />
                            Edit Prescription
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                            Create New Prescription
                        </>
                    )}
                </h2>
            </div>

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
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2 text-cyan-500"/>
                    Diagnosis & Instructions
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Diagnosis <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            value={formData.diagnosis} 
                            onChange={(e) => handleInputChange('diagnosis', e.target.value)} 
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" 
                            rows={2} 
                            placeholder="e.g., Acute Bronchitis" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            General Instructions
                        </label>
                        <textarea 
                            value={formData.instructions} 
                            onChange={(e) => handleInputChange('instructions', e.target.value)} 
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" 
                            rows={2} 
                            placeholder="e.g., Take rest, stay hydrated" 
                        />
                    </div>
                </div>
            </div>
            
            {/* Medications Section */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-cyan-500"/>
                    Medications
                </h3>
                <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
            </div>

            {/* Investigations Section */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                    <Beaker className="w-4 h-4 mr-2 text-cyan-500"/>
                    Investigations
                </h3>
                <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
            </div>
            
            {/* File Upload Section */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
                    <UploadCloud className="w-4 h-4 mr-2 text-cyan-500"/>
                    Prescription Files
                </h3>
                
                {/* Existing files */}
                {existingFiles.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Existing Files:</h4>
                        <div className="space-y-2">
                            {existingFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{file.file_name}</p>
                                            <p className="text-xs text-gray-500">
                                                Uploaded: {new Date(file.uploaded_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* New file upload */}
                <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 mt-4">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting || !formData.diagnosis || successMessage} 
                    className="px-5 py-2 text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Prescription' : 'Save Prescription')}</span>
                </button>
            </div>
        </form>
    );
};

export default PrescriptionForm;



// import React, { useState } from 'react';
// import { Save, AlertCircle, CheckCircle, User, Stethoscope, Beaker, Pill, UploadCloud } from 'lucide-react';
// import DrugSelector from './DrugSelector';
// import InvestigationSelector from './InvestigationSelector';
// import FileUpload from './FileUpload';
// import { usePrescriptionData } from './hooks/usePrescriptionData';
// import { useFileUpload } from './hooks/useFileUpload';

// const PrescriptionForm = ({ appointment, onClose }) => {
//     // 'follow_up_date' has been removed from the initial state
//     const [formData, setFormData] = useState({
//         appointment_id: appointment.appointment_id,
//         diagnosis: '',
//         instructions: '',
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
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleDrugsChange = (drugs) => {
//         setFormData(prev => ({ ...prev, drugs }));
//     };

//     const handleInvestigationsChange = (investigations) => {
//         setFormData(prev => ({ ...prev, investigations }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError('');
//         setSuccessMessage('');

//         try {
//             // Submission logic is simplified without follow_up_date
//             const prescriptionData = {
//                 ...formData,
//                 drugs: formData.drugs.filter(drug => drug.drug_id),
//                 investigations: formData.investigations.filter(inv => inv.investigation_id),
//             };

//             const result = await createPrescription(prescriptionData);
            
//             if (result.success) {
//                 const prescriptionId = result.data.prescription_id;
                
//                 if (uploadedFiles.length > 0) {
//                     await uploadPrescriptionFiles(prescriptionId, uploadedFiles);
//                 }
                
//                 setSuccessMessage('Prescription created successfully!');
//                 setTimeout(() => onClose(), 1500);
//             } else {
//                 setError(result.error || 'Failed to create prescription');
//             }
//         } catch (err) {
//             setError('An error occurred. Please try again.');
//             console.error('Error:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <form 
//             onSubmit={handleSubmit} 
//             className="space-y-4 animate-fade-in" // Reduced vertical spacing
//         >
//             {/* Patient Information Header */}
//             <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
//                 <div className="flex items-center space-x-4">
//                     <div className="p-3 bg-white rounded-full shadow-md">
//                         <User className="w-6 h-6 text-sky-500" />
//                     </div>
//                     <div>
//                         <h3 className="font-bold text-lg text-slate-800">
//                             {appointment.patient_first_name} {appointment.patient_last_name}
//                         </h3>
//                         <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
//                             <span>ID: {appointment.patient_id}</span>
//                             <span>|</span>
//                             <span>Age: {new Date().getFullYear() - new Date(appointment.date_of_birth).getFullYear()}</span>
//                             <span>|</span>
//                             <span>Gender: {appointment.patient_gender}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Error and Success Messages */}
//             {error && (
//                 <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start space-x-3">
//                     <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
//                     <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//             )}
//             {successMessage && (
//                 <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-start space-x-3">
//                     <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
//                     <p className="text-green-700 text-sm">{successMessage}</p>
//                 </div>
//             )}
            
//             {/* Core Prescription Details Section */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-cyan-500"/>Diagnosis & Instructions</h3>
//                 <div className="space-y-3">
//                     <div>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis <span className="text-red-500">*</span></label>
//                         <textarea value={formData.diagnosis} onChange={(e) => handleInputChange('diagnosis', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" rows={2} placeholder="e.g., Acute Bronchitis" required />
//                     </div>
//                     <div>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">General Instructions</label>
//                         <textarea value={formData.instructions} onChange={(e) => handleInputChange('instructions', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" rows={2} placeholder="e.g., Take rest, stay hydrated" />
//                     </div>
//                 </div>
//             </div>
            
//             {/* Medications Section - More Compact */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Pill className="w-4 h-4 mr-2 text-cyan-500"/>Medications</h3>
//                 <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
//             </div>

//             {/* Investigations Section - More Compact */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><Beaker className="w-4 h-4 mr-2 text-cyan-500"/>Investigations</h3>
//                 <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
//             </div>
            
//             {/* File Upload Section - Full Width */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center"><UploadCloud className="w-4 h-4 mr-2 text-cyan-500"/>Upload Files</h3>
//                 <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 mt-4">
//                 <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors">Cancel</button>
//                 <button type="submit" disabled={isSubmitting || !formData.diagnosis || successMessage} className="px-5 py-2 text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105">
//                     <Save className="w-4 h-4" />
//                     <span>{isSubmitting ? 'Saving...' : 'Save Prescription'}</span>
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default PrescriptionForm;


