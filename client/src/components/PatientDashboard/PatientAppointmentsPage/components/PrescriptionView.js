import React from 'react';

const PrescriptionView = ({ prescription }) => {
    if (!prescription) return <div>No prescription data available.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Diagnosis</h4>
                <p className="text-slate-600">{prescription.diagnosis || 'Not specified'}</p>
            </div>

            {prescription.instructions && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Instructions</h4>
                    <p className="text-slate-600">{prescription.instructions}</p>
                </div>
            )}

            {prescription.drugs && prescription.drugs.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Prescribed Medications</h4>
                    <div className="space-y-3">
                        {prescription.drugs.map((drug, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="font-medium text-slate-800">{drug.drug_name}</div>
                                <div className="text-sm text-slate-600">
                                    Dosage: {drug.dosages} | Frequency: {drug.frequency_per_day}/day | Duration: {drug.duration}
                                </div>
                                {drug.additional_notes && (
                                    <div className="text-sm text-slate-500 mt-1">Notes: {drug.additional_notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {prescription.investigations && prescription.investigations.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Recommended Tests</h4>
                    <div className="space-y-2">
                        {prescription.investigations.map((investigation, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="font-medium text-slate-800">{investigation.name}</div>
                                {investigation.notes && (
                                    <div className="text-sm text-slate-600 mt-1">Notes: {investigation.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {prescription.other_drugs && (
                <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Other Medications</h4>
                    <p className="text-slate-600">{prescription.other_drugs}</p>
                </div>
            )}
        </div>
    );
};

export default PrescriptionView;
