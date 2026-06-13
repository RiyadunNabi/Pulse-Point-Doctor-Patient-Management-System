// //client\src\components\DoctorDashboard\ManageAppointments\PrescriptionModal\PrescriptionForm.js
// import React, { useState, useEffect } from 'react';
// import { Save, AlertCircle, CheckCircle, User, Stethoscope, Beaker, Pill, UploadCloud, Edit, FileText } from 'lucide-react';
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
//         drugs: [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
//         investigations: [{ investigation_id: '', notes: '' }]
//     });

//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [existingFiles, setExistingFiles] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [prescriptionId, setPrescriptionId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const { createPrescription, getPrescriptionByAppointmentId, updatePrescription } = usePrescriptionData();
//     const { uploadPrescriptionFiles, getPrescriptionFiles } = useFileUpload();

//     // Load existing prescription on component mount
//     useEffect(() => {
//         const loadExistingPrescription = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const result = await getPrescriptionByAppointmentId(appointment.appointment_id);

//                 if (!result.success) {
//                     // real error
//                     setError(result.error);
//                 } else if (!result.data) {
//                     // no prescription yet — leave form blank
//                     setIsEditMode(false);
//                     setPrescriptionId(null);
//                 } else if (result.success) {
//                     // Prescription exists - populate form for editing
//                     const prescription = result.data;
//                     setIsEditMode(true);
//                     setPrescriptionId(prescription.prescription_id);

//                     setFormData({
//                         appointment_id: appointment.appointment_id,
//                         diagnosis: prescription.diagnosis || '',
//                         instructions: prescription.instructions || '',
//                         drugs: prescription.drugs && prescription.drugs.length > 0
//                             ? prescription.drugs.map(drug => ({
//                                 drug_id: drug.drug_id,
//                                 dosages: drug.dosages || '',
//                                 frequency_per_day: drug.frequency_per_day || 1,
//                                 duration: drug.duration || '',
//                                 additional_notes: drug.additional_notes || ''
//                             }))
//                             : [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
//                         investigations: prescription.investigations && prescription.investigations.length > 0
//                             ? prescription.investigations.map(inv => ({
//                                 investigation_id: inv.investigation_id,
//                                 notes: inv.notes || ''
//                             }))
//                             : [{ investigation_id: '', notes: '' }]
//                     });

//                     // Load existing files
//                     const filesResult = await getPrescriptionFiles(prescription.prescription_id);
//                     if (filesResult.success) {
//                         setExistingFiles(filesResult.data);
//                     }
//                 }
//             } catch (err) {
//                 console.error('Error loading prescription:', err);
//                 setError('Failed to load prescription');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadExistingPrescription();
//     }, [appointment.appointment_id]);

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

//         // 1) Ask the user to confirm before proceeding
//         const confirmMsg = isEditMode
//             ? 'Update this prescription?'
//             : 'Save a new prescription?';
//         if (!window.confirm(confirmMsg)) {
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const prescriptionData = {
//                 ...formData,
//                 drugs: formData.drugs.filter(drug => drug.drug_id),
//                 investigations: formData.investigations.filter(inv => inv.investigation_id),
//             };

//             let result;
//             let currentPrescriptionId = prescriptionId;

//             if (isEditMode) {
//                 // Update existing prescription
//                 result = await updatePrescription(prescriptionId, prescriptionData);
//             } else {
//                 // Create new prescription
//                 result = await createPrescription(prescriptionData);
//                 if (result.success) {
//                     currentPrescriptionId = result.data.prescription_id;
//                     setPrescriptionId(currentPrescriptionId);
//                     setIsEditMode(true);
//                 }
//             }

//             if (result.success) {
//                 // Upload new files if any
//                 if (uploadedFiles.length > 0) {
//                     const uploadResult = await uploadPrescriptionFiles(currentPrescriptionId, uploadedFiles);
//                     if (uploadResult.success) {
//                         // Refresh existing files list
//                         const filesResult = await getPrescriptionFiles(currentPrescriptionId);
//                         if (filesResult.success) {
//                             setExistingFiles(filesResult.data);
//                         }
//                         setUploadedFiles([]); // Clear uploaded files
//                     }
//                 }

//                 // setSuccessMessage(isEditMode ? 'Prescription updated successfully!' : 'Prescription created successfully!');
//                 // setTimeout(() => onClose(), 1500);
//                 const msg = isEditMode
//                     ? 'Prescription updated successfully!'
//                     : 'Prescription created successfully!';
//                 // 3) Inline banner
//                 setSuccessMessage(msg);
//                 // 4) Browser alert for extra confirmation
//                 window.alert(msg);
//                 // 5) Close modal after a brief pause
//                 setTimeout(() => onClose(), 500);
//             } else {
//                 setError(result.error || 'Failed to save prescription');
//             }
//         } catch (err) {
//             setError('An error occurred. Please try again.');
//             console.error('Error:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//                 <span className="ml-3 text-slate-600">Loading prescription...</span>
//             </div>
//         );
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
//             {/* Header with mode indicator */}
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-slate-800 flex items-center">
//                     {isEditMode ? (
//                         <>
//                             <Edit className="w-5 h-5 mr-2 text-blue-500" />
//                             Edit Prescription
//                         </>
//                     ) : (
//                         <>
//                             <FileText className="w-5 h-5 mr-2 text-emerald-500" />
//                             Create New Prescription
//                         </>
//                     )}
//                 </h2>
//             </div>

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
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
//                     <Stethoscope className="w-4 h-4 mr-2 text-cyan-500" />
//                     Diagnosis & Instructions
//                 </h3>
//                 <div className="space-y-3">
//                     <div>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">
//                             Diagnosis <span className="text-red-500">*</span>
//                         </label>
//                         <textarea
//                             value={formData.diagnosis}
//                             onChange={(e) => handleInputChange('diagnosis', e.target.value)}
//                             className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
//                             rows={2}
//                             placeholder="e.g., Acute Bronchitis"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">
//                             General Instructions
//                         </label>
//                         <textarea
//                             value={formData.instructions}
//                             onChange={(e) => handleInputChange('instructions', e.target.value)}
//                             className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
//                             rows={2}
//                             placeholder="e.g., Take rest, stay hydrated"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Medications Section */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
//                     <Pill className="w-4 h-4 mr-2 text-cyan-500" />
//                     Medications
//                 </h3>
//                 <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
//             </div>

//             {/* Investigations Section */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
//                     <Beaker className="w-4 h-4 mr-2 text-cyan-500" />
//                     Investigations
//                 </h3>
//                 <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
//             </div>

//             {/* File Upload Section */}
//             <div className="p-4 border rounded-xl shadow-sm bg-white">
//                 <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center">
//                     <UploadCloud className="w-4 h-4 mr-2 text-cyan-500" />
//                     Prescription Files
//                 </h3>

//                 {/* Existing files */}
//                 {existingFiles.length > 0 && (
//                     <div className="mb-4">
//                         <h4 className="font-medium text-gray-700 mb-2">Existing Files:</h4>
//                         <div className="space-y-2">
//                             {existingFiles.map((file, index) => (
//                                 <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
//                                     <div className="flex items-center space-x-3">
//                                         <FileText className="w-5 h-5 text-green-600" />
//                                         <div>
//                                             <p className="font-medium text-gray-800 text-sm">{file.file_name}</p>
//                                             <p className="text-xs text-gray-500">
//                                                 Uploaded: {new Date(file.uploaded_time).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* New file upload */}
//                 <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 mt-4">
//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-5 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={isSubmitting || !formData.diagnosis || successMessage}
//                     className="px-5 py-2 text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
//                 >
//                     <Save className="w-4 h-4" />
//                     <span>{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Prescription' : 'Save Prescription')}</span>
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default PrescriptionForm;


// import React, { useState, useEffect } from 'react';
// import { Save, AlertCircle, CheckCircle, User, Stethoscope, Beaker, Pill, UploadCloud, Edit, FileText } from 'lucide-react';
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
//         drugs: [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
//         investigations: [{ investigation_id: '', notes: '' }]
//     });

//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [existingFiles, setExistingFiles] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [prescriptionId, setPrescriptionId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const { createPrescription, getPrescriptionByAppointmentId, updatePrescription } = usePrescriptionData();
//     const { uploadPrescriptionFiles, getPrescriptionFiles } = useFileUpload();

//     // Load existing prescription on component mount
//     useEffect(() => {
//         const loadExistingPrescription = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const result = await getPrescriptionByAppointmentId(appointment.appointment_id);

//                 if (!result.success) {
//                     setError(result.error);
//                 } else if (!result.data) {
//                     setIsEditMode(false);
//                     setPrescriptionId(null);
//                 } else if (result.success) {
//                     const prescription = result.data;
//                     setIsEditMode(true);
//                     setPrescriptionId(prescription.prescription_id);

//                     setFormData({
//                         appointment_id: appointment.appointment_id,
//                         diagnosis: prescription.diagnosis || '',
//                         instructions: prescription.instructions || '',
//                         drugs: prescription.drugs && prescription.drugs.length > 0
//                             ? prescription.drugs.map(drug => ({
//                                 drug_id: drug.drug_id,
//                                 dosages: drug.dosages || '',
//                                 frequency_per_day: drug.frequency_per_day || 1,
//                                 duration: drug.duration || '',
//                                 additional_notes: drug.additional_notes || ''
//                             }))
//                             : [{ drug_id: '', dosages: '', frequency_per_day: 1, duration: '', additional_notes: '' }],
//                         investigations: prescription.investigations && prescription.investigations.length > 0
//                             ? prescription.investigations.map(inv => ({
//                                 investigation_id: inv.investigation_id,
//                                 notes: inv.notes || ''
//                             }))
//                             : [{ investigation_id: '', notes: '' }]
//                     });

//                     const filesResult = await getPrescriptionFiles(prescription.prescription_id);
//                     if (filesResult.success) {
//                         setExistingFiles(filesResult.data);
//                     }
//                 }
//             } catch (err) {
//                 console.error('Error loading prescription:', err);
//                 setError('Failed to load prescription');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadExistingPrescription();
//     }, [appointment.appointment_id]);

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

//         const confirmMsg = isEditMode
//             ? 'Update this prescription?'
//             : 'Save a new prescription?';
//         if (!window.confirm(confirmMsg)) {
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const prescriptionData = {
//                 ...formData,
//                 drugs: formData.drugs.filter(drug => drug.drug_id),
//                 investigations: formData.investigations.filter(inv => inv.investigation_id),
//             };

//             let result;
//             let currentPrescriptionId = prescriptionId;

//             if (isEditMode) {
//                 result = await updatePrescription(prescriptionId, prescriptionData);
//             } else {
//                 result = await createPrescription(prescriptionData);
//                 if (result.success) {
//                     currentPrescriptionId = result.data.prescription_id;
//                     setPrescriptionId(currentPrescriptionId);
//                     setIsEditMode(true);
//                 }
//             }

//             if (result.success) {
//                 if (uploadedFiles.length > 0) {
//                     const uploadResult = await uploadPrescriptionFiles(currentPrescriptionId, uploadedFiles);
//                     if (uploadResult.success) {
//                         const filesResult = await getPrescriptionFiles(currentPrescriptionId);
//                         if (filesResult.success) {
//                             setExistingFiles(filesResult.data);
//                         }
//                         setUploadedFiles([]);
//                     }
//                 }

//                 const msg = isEditMode
//                     ? 'Prescription updated successfully!'
//                     : 'Prescription created successfully!';
//                 setSuccessMessage(msg);
//                 window.alert(msg);
//                 setTimeout(() => onClose(), 500);
//             } else {
//                 setError(result.error || 'Failed to save prescription');
//             }
//         } catch (err) {
//             setError('An error occurred. Please try again.');
//             console.error('Error:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
//                 <span className="ml-2 text-slate-600 text-xs">Loading prescription...</span>
//             </div>
//         );
//     }

//     return (
//         <div className="relative">
//             {/* Decorative Background Elements */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
//                 {/* Header with mode indicator */}
//                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm">
//                     <h2 className="text-sm font-semibold text-slate-800 flex items-center">
//                         {isEditMode ? (
//                             <>
//                                 <Edit className="w-4 h-4 mr-2 text-blue-500" />
//                                 Edit Prescription
//                             </>
//                         ) : (
//                             <>
//                                 <FileText className="w-4 h-4 mr-2 text-emerald-500" />
//                                 Create New Prescription
//                             </>
//                         )}
//                     </h2>
//                 </div>

//                 {/* Patient Information Header */}
//                 <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
//                     <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
//                             <User className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                             <h3 className="font-bold text-sm text-slate-800">
//                                 {appointment.patient_first_name} {appointment.patient_last_name}
//                             </h3>
//                             <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
//                                 <span>ID: {appointment.patient_id}</span>
//                                 <span>•</span>
//                                 <span>Age: {new Date().getFullYear() - new Date(appointment.date_of_birth).getFullYear()}</span>
//                                 <span>•</span>
//                                 <span>Gender: {appointment.patient_gender}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Error and Success Messages */}
//                 {error && (
//                     <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 p-3 rounded-lg flex items-start space-x-2">
//                         <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
//                         <p className="text-red-700 text-xs">{error}</p>
//                     </div>
//                 )}
//                 {successMessage && (
//                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-3 rounded-lg flex items-start space-x-2">
//                         <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                         <p className="text-green-700 text-xs">{successMessage}</p>
//                     </div>
//                 )}

//                 {/* Core Prescription Details Section */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
//                     <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
//                         <Stethoscope className="w-4 h-4 mr-2 text-green-600" />
//                         Diagnosis & Instructions
//                     </h3>
//                     <div className="space-y-3">
//                         <div>
//                             <label className="block text-xs font-medium text-slate-700 mb-1">
//                                 Diagnosis <span className="text-red-500">*</span>
//                             </label>
//                             <textarea
//                                 value={formData.diagnosis}
//                                 onChange={(e) => handleInputChange('diagnosis', e.target.value)}
//                                 className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                                 rows={2}
//                                 placeholder="e.g., Acute Bronchitis"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-xs font-medium text-slate-700 mb-1">
//                                 General Instructions
//                             </label>
//                             <textarea
//                                 value={formData.instructions}
//                                 onChange={(e) => handleInputChange('instructions', e.target.value)}
//                                 className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                                 rows={2}
//                                 placeholder="e.g., Take rest, stay hydrated"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Medications Section */}
//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
//                     <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
//                         <Pill className="w-4 h-4 mr-2 text-purple-600" />
//                         Medications
//                     </h3>
//                     <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-300">
//                         <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
//                     </div>
//                 </div>

//                 {/* Investigations Section */}
//                 <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
//                     <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
//                         <Beaker className="w-4 h-4 mr-2 text-cyan-600" />
//                         Investigations
//                     </h3>
//                     <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-300">
//                         <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
//                     </div>
//                 </div>

//                 {/* File Upload Section */}
//                 <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
//                     <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
//                         <UploadCloud className="w-4 h-4 mr-2 text-indigo-600" />
//                         Prescription Files
//                     </h3>

//                     {/* Existing files */}
//                     {existingFiles.length > 0 && (
//                         <div className="mb-3">
//                             <h4 className="font-medium text-slate-700 mb-2 text-xs">Existing Files:</h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                 {existingFiles.map((file, index) => (
//                                     <div key={index} className="flex items-center space-x-2 p-2 bg-white/70 backdrop-blur-sm rounded-lg border border-green-300 shadow-sm hover:shadow-md transition-all duration-200">
//                                         <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-medium text-slate-800 text-xs truncate">{file.file_name}</p>
//                                             <p className="text-xs text-slate-500">
//                                                 {new Date(file.uploaded_time).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* New file upload */}
//                     <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
//                         <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="px-4 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={isSubmitting || !formData.diagnosis || successMessage}
//                         className="px-4 py-2 text-xs bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
//                     >
//                         <Save className="w-3 h-3" />
//                         <span>{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Prescription' : 'Save Prescription')}</span>
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default PrescriptionForm;




//=====================================================================
import React, { useState, useEffect } from 'react';
import { 
    Save, 
    AlertCircle, 
    CheckCircle, 
    User, 
    Stethoscope, 
    Beaker, 
    Pill, 
    UploadCloud, 
    Edit, 
    FileText,
    TestTube, 
    Eye, 
    Download, 
    ExternalLink,
    X
} from 'lucide-react';
import DrugSelector from './DrugSelector';
import InvestigationSelector from './InvestigationSelector';
import FileUpload from './FileUpload';
import { usePrescriptionData } from './hooks/usePrescriptionData';
import { useFileUpload } from './hooks/useFileUpload';
import axios from 'axios';

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
    
    // Investigation reports state
    const [investigationReports, setInvestigationReports] = useState([]);
    const [showReportPreview, setShowReportPreview] = useState(false);
    const [previewReport, setPreviewReport] = useState(null);

    const { createPrescription, getPrescriptionByAppointmentId, updatePrescription } = usePrescriptionData();
    const { uploadPrescriptionFiles, getPrescriptionFiles } = useFileUpload();

    // Fetch investigation reports
    const fetchInvestigationReports = async (prescriptionId) => {
        try {
            const response = await axios.get(`/api/investigation-reports/prescription/${prescriptionId}`);
            setInvestigationReports(response.data);
        } catch (error) {
            console.error('Error fetching investigation reports:', error);
        }
    };

    // Handler functions for investigation reports
    const handlePreviewReport = async (reportId, fileName, fileType) => {
        try {
            const response = await axios.get(`/api/investigation-reports/${reportId}/download`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);
            
            setPreviewReport({
                url,
                name: fileName,
                type: fileType
            });
            setShowReportPreview(true);
        } catch (error) {
            console.error('Error previewing report:', error);
            alert('Failed to preview report. Please try again.');
        }
    };

    const handleDownloadReport = async (reportId, fileName) => {
        try {
            const response = await axios.get(`/api/investigation-reports/${reportId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const closeReportPreview = () => {
        if (previewReport?.url) {
            window.URL.revokeObjectURL(previewReport.url);
        }
        setPreviewReport(null);
        setShowReportPreview(false);
    };

    // Load existing prescription on component mount
    useEffect(() => {
        const loadExistingPrescription = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getPrescriptionByAppointmentId(appointment.appointment_id);

                if (!result.success) {
                    setError(result.error);
                } else if (!result.data) {
                    setIsEditMode(false);
                    setPrescriptionId(null);
                } else if (result.success) {
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

                    const filesResult = await getPrescriptionFiles(prescription.prescription_id);
                    if (filesResult.success) {
                        setExistingFiles(filesResult.data);
                    }

                    // Fetch investigation reports
                    await fetchInvestigationReports(prescription.prescription_id);
                }
            } catch (err) {
                console.error('Error loading prescription:', err);
                setError('Failed to load prescription');
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

        const confirmMsg = isEditMode
            ? 'Update this prescription?'
            : 'Save a new prescription?';
        if (!window.confirm(confirmMsg)) {
            setIsSubmitting(false);
            return;
        }

        try {
            const prescriptionData = {
                ...formData,
                drugs: formData.drugs.filter(drug => drug.drug_id),
                investigations: formData.investigations.filter(inv => inv.investigation_id),
            };

            let result;
            let currentPrescriptionId = prescriptionId;

            if (isEditMode) {
                result = await updatePrescription(prescriptionId, prescriptionData);
            } else {
                result = await createPrescription(prescriptionData);
                if (result.success) {
                    currentPrescriptionId = result.data.prescription_id;
                    setPrescriptionId(currentPrescriptionId);
                    setIsEditMode(true);
                }
            }

            if (result.success) {
                if (uploadedFiles.length > 0) {
                    const uploadResult = await uploadPrescriptionFiles(currentPrescriptionId, uploadedFiles);
                    if (uploadResult.success) {
                        const filesResult = await getPrescriptionFiles(currentPrescriptionId);
                        if (filesResult.success) {
                            setExistingFiles(filesResult.data);
                        }
                        setUploadedFiles([]);
                    }
                }

                const msg = isEditMode
                    ? 'Prescription updated successfully!'
                    : 'Prescription created successfully!';
                setSuccessMessage(msg);
                window.alert(msg);
                setTimeout(() => onClose(), 500);
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
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                <span className="ml-2 text-slate-600 text-xs">Loading prescription...</span>
            </div>
        );
    }

    return (
        <>
            <div className="relative">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {/* Header with mode indicator */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-800 flex items-center">
                            {isEditMode ? (
                                <>
                                    <Edit className="w-4 h-4 mr-2 text-blue-500" />
                                    Edit Prescription
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                                    Create New Prescription
                                </>
                            )}
                        </h2>
                    </div>

                    {/* Patient Information Header */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-800">
                                    {appointment.patient_first_name} {appointment.patient_last_name}
                                </h3>
                                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                                    <span>ID: {appointment.patient_id}</span>
                                    <span>•</span>
                                    <span>Age: {new Date().getFullYear() - new Date(appointment.date_of_birth).getFullYear()}</span>
                                    <span>•</span>
                                    <span>Gender: {appointment.patient_gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 p-3 rounded-lg flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 text-xs">{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-3 rounded-lg flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-green-700 text-xs">{successMessage}</p>
                        </div>
                    )}

                    {/* Core Prescription Details Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                            <Stethoscope className="w-4 h-4 mr-2 text-green-600" />
                            Diagnosis & Instructions
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Diagnosis <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.diagnosis}
                                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    rows={2}
                                    placeholder="e.g., Acute Bronchitis"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    General Instructions
                                </label>
                                <textarea
                                    value={formData.instructions}
                                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    rows={2}
                                    placeholder="e.g., Take rest, stay hydrated"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medications Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                            <Pill className="w-4 h-4 mr-2 text-purple-600" />
                            Medications
                        </h3>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-300">
                            <DrugSelector drugs={formData.drugs} onChange={handleDrugsChange} />
                        </div>
                    </div>

                    {/* Investigations Section */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                            <Beaker className="w-4 h-4 mr-2 text-cyan-600" />
                            Investigations
                        </h3>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-300">
                            <InvestigationSelector investigations={formData.investigations} onChange={handleInvestigationsChange} />
                        </div>
                    </div>

                    {/* Investigation Reports Section - Show existing reports if any */}
                    {investigationReports.length > 0 && (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                <TestTube className="w-4 h-4 mr-2 text-orange-600" />
                                Patient's Investigation Reports ({investigationReports.length})
                            </h3>
                            
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-orange-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {investigationReports.map((report) => (
                                        <div
                                            key={report.report_id}
                                            className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-start space-x-2 flex-1 min-w-0">
                                                    <TestTube className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <h5 className="font-semibold text-slate-800 text-xs mb-1 truncate">
                                                            {report.investigation_name}
                                                        </h5>
                                                        <p className="text-xs text-slate-600 mb-1 truncate">
                                                            <span className="font-medium">File:</span> {report.file_name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Uploaded: {new Date(report.uploaded_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreviewReport(report.report_id, report.file_name, report.file_type)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors text-xs"
                                                    title="Quick Preview"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>Preview</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownloadReport(report.report_id, report.file_name)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors text-xs"
                                                    title="Download Report"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                            
                                            {report.notes && (
                                                <div className="bg-orange-50 rounded-lg p-2 border border-orange-200 mt-2">
                                                    <p className="text-xs text-slate-700">
                                                        <span className="font-medium text-orange-700">Notes:</span> {report.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* File Upload Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                            <UploadCloud className="w-4 h-4 mr-2 text-indigo-600" />
                            Prescription Files
                        </h3>

                        {/* Existing files */}
                        {existingFiles.length > 0 && (
                            <div className="mb-3">
                                <h4 className="font-medium text-slate-700 mb-2 text-xs">Existing Files:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {existingFiles.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/70 backdrop-blur-sm rounded-lg border border-green-300 shadow-sm hover:shadow-md transition-all duration-200">
                                            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 text-xs truncate">{file.file_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(file.uploaded_time).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New file upload */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-300">
                            <FileUpload files={uploadedFiles} onChange={setUploadedFiles} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.diagnosis || successMessage}
                            className="px-4 py-2 text-xs bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium rounded-lg hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                            <Save className="w-3 h-3" />
                            <span>{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Prescription' : 'Save Prescription')}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Report Preview Modal */}
            {showReportPreview && previewReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-white">Report Preview</h3>
                                <p className="text-sm text-sky-100">{previewReport.name}</p>
                            </div>
                            <button
                                onClick={closeReportPreview}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="w-full max-h-96 overflow-auto border rounded-lg bg-gray-50">
                                {previewReport.type.includes('pdf') ? (
                                    <embed
                                        src={previewReport.url}
                                        type="application/pdf"
                                        width="100%"
                                        height="400px"
                                        className="rounded-lg"
                                    />
                                ) : previewReport.type.includes('image') ? (
                                    <img
                                        src={previewReport.url}
                                        alt={previewReport.name}
                                        className="w-full h-auto max-h-96 object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-40">
                                        <p className="text-gray-500">Preview not available for this file type</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
                            <button
                                onClick={() => window.open(previewReport.url, '_blank')}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Open in New Tab</span>
                            </button>
                            <button
                                onClick={closeReportPreview}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PrescriptionForm;
