// import React, { useState, useEffect } from 'react';
// import { Plus, Minus, Stethoscope } from 'lucide-react';

// const InvestigationSelector = ({ investigations, onChange }) => {
//     const [availableInvestigations, setAvailableInvestigations] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchInvestigations();
//     }, []);

//     const fetchInvestigations = async () => {
//         try {
//             const response = await fetch('/api/investigations');
//             const data = await response.json();
//             setAvailableInvestigations(data);
//         } catch (error) {
//             console.error('Error fetching investigations:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addInvestigation = () => {
//         const newInvestigation = {
//             investigation_id: '',
//             notes: ''
//         };
//         onChange([...investigations, newInvestigation]);
//     };

//     const removeInvestigation = (index) => {
//         if (investigations.length > 1) {
//             const newInvestigations = investigations.filter((_, i) => i !== index);
//             onChange(newInvestigations);
//         }
//     };

//     const updateInvestigation = (index, field, value) => {
//         const newInvestigations = investigations.map((investigation, i) => 
//             i === index ? { ...investigation, [field]: value } : investigation
//         );
//         onChange(newInvestigations);
//     };

//     if (loading) {
//         return <div className="text-center py-4">Loading investigations...</div>;
//     }

//     return (
//         <div className="space-y-4">
//             {investigations.map((investigation, index) => (
//                 <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
//                     <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center space-x-2">
//                             <Stethoscope className="w-5 h-5 text-purple-600" />
//                             <span className="font-medium text-gray-700">Investigation {index + 1}</span>
//                         </div>
//                         {investigations.length > 1 && (
//                             <button
//                                 type="button"
//                                 onClick={() => removeInvestigation(index)}
//                                 className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
//                             >
//                                 <Minus className="w-4 h-4" />
//                             </button>
//                         )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Investigation/Test
//                             </label>
//                             <select
//                                 value={investigation.investigation_id}
//                                 onChange={(e) => updateInvestigation(index, 'investigation_id', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                             >
//                                 <option value="">Select an investigation...</option>
//                                 {availableInvestigations.map((availableInvestigation) => (
//                                     <option key={availableInvestigation.investigation_id} value={availableInvestigation.investigation_id}>
//                                         {availableInvestigation.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Notes
//                             </label>
//                             <textarea
//                                 value={investigation.notes}
//                                 onChange={(e) => updateInvestigation(index, 'notes', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
//                                 rows={3}
//                                 placeholder="Any specific instructions or notes..."
//                             />
//                         </div>
//                     </div>
//                 </div>
//             ))}

//             <button
//                 type="button"
//                 onClick={addInvestigation}
//                 className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-purple-600 font-medium"
//             >
//                 <Plus className="w-5 h-5" />
//                 <span>Add Another Investigation</span>
//             </button>
//         </div>
//     );
// };

// export default InvestigationSelector;

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Stethoscope } from 'lucide-react';

const InvestigationSelector = ({ investigations, onChange }) => {
    const [availableInvestigations, setAvailableInvestigations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvestigations = async () => {
            try {
                // 1. Get the auth token
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication token not found in local storage.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/investigations', {
                    headers: {
                        // 2. Add the Authorization header
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // 3. Check for a successful response
                if (!response.ok) {
                   const errorText = await response.text();
                    console.error("Failed response text:", errorText);
                    throw new Error(`Failed to fetch investigations. Status: ${response.status}. See console for server response.`);
                }

                const data = await response.json();
                setAvailableInvestigations(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching investigations:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestigations();
    }, []);

    const addInvestigation = () => {
        const newInvestigation = {
            investigation_id: '',
            notes: ''
        };
        onChange([...investigations, newInvestigation]);
    };

    const removeInvestigation = (index) => {
        if (investigations.length > 1) {
            const newInvestigations = investigations.filter((_, i) => i !== index);
            onChange(newInvestigations);
        }
    };

    const updateInvestigation = (index, field, value) => {
        const newInvestigations = investigations.map((investigation, i) =>
            i === index ? { ...investigation, [field]: value } : investigation
        );
        onChange(newInvestigations);
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading investigations...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            {investigations.map((investigation, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <Stethoscope className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700">Investigation {index + 1}</span>
                        </div>
                        {investigations.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeInvestigation(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Investigation/Test
                            </label>
                            <select
                                value={investigation.investigation_id}
                                onChange={(e) => updateInvestigation(index, 'investigation_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Select an investigation...</option>
                                {availableInvestigations.map((availableInv) => (
                                    <option key={availableInv.investigation_id} value={availableInv.investigation_id}>
                                        {availableInv.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={investigation.notes}
                                onChange={(e) => updateInvestigation(index, 'notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                rows={2}
                                placeholder="Any specific instructions or notes..."
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addInvestigation}
                className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-purple-600 font-medium"
            >
                <Plus className="w-5 h-5" />
                <span>Add Another Investigation</span>
            </button>
        </div>
    );
};

export default InvestigationSelector;
