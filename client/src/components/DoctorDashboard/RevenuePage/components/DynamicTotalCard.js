// client/src/components/DoctorDashboard/RevenuePage/components/DynamicTotalCard.js
import React from 'react';
import { Sigma } from 'lucide-react'; // Using Sigma for 'Sum' or 'Total'

function DynamicTotalCard({ label, total }) {
    return (
        <div className="mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                            <Sigma className="w-6 h-6 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600">{label}</p>
                            <p className="text-2xl font-bold text-slate-800">
                                ${total.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DynamicTotalCard;
