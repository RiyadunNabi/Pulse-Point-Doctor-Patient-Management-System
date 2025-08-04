

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Pill } from 'lucide-react';
import axios from '../../../../utils/axiosConfig';

const DrugSelector = ({ drugs, onChange }) => {
    const [availableDrugs, setAvailableDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const response = await axios.get('/api/drugs');
                const data = await response.data;
                setAvailableDrugs(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrugs();
    }, []);

    const addDrug = () => {
        const newDrug = {
            drug_id: '',
            dosages: '',
            frequency_per_day: 1,
            duration: '',
            additional_notes: ''
        };
        onChange([...drugs, newDrug]);
    };

    const removeDrug = (index) => {
        if (drugs.length > 1) {
            const newDrugs = drugs.filter((_, i) => i !== index);
            onChange(newDrugs);
        }
    };

    const updateDrug = (index, field, value) => {
        const newDrugs = drugs.map((drug, i) =>
            i === index ? { ...drug, [field]: value } : drug
        );
        onChange(newDrugs);
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading drugs...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            {drugs.map((drug, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <Pill className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Drug {index + 1}</span>
                        </div>
                        {drugs.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeDrug(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Drug Name
                            </label>
                            <select
                                value={drug.drug_id}
                                onChange={(e) => updateDrug(index, 'drug_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a drug...</option>
                                {availableDrugs.map((availableDrug) => (
                                    <option key={availableDrug.drug_id} value={availableDrug.drug_id}>
                                        {availableDrug.drug_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dosages
                            </label>
                            <input
                                type="text"
                                value={drug.dosages}
                                onChange={(e) => updateDrug(index, 'dosages', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 250mg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Frequency per Day
                            </label>
                            <input
                                type="number"
                                value={drug.frequency_per_day}
                                onChange={(e) => updateDrug(index, 'frequency_per_day', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                                max="6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                value={drug.duration}
                                onChange={(e) => updateDrug(index, 'duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 7 days"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Notes
                            </label>
                            <textarea
                                value={drug.additional_notes}
                                onChange={(e) => updateDrug(index, 'additional_notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={2}
                                placeholder="Any additional instructions..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addDrug}
                className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-blue-600 font-medium"
            >
                <Plus className="w-5 h-5" />
                <span>Add Another Drug</span>
            </button>
        </div>
    );
};

export default DrugSelector;
