import React from 'react';
import { Calendar } from 'lucide-react';

const EmptyState = ({ activeTab }) => {
    const getEmptyStateConfig = () => {
        switch (activeTab) {
            case 'pending':
                return {
                    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
                    iconColor: 'text-amber-600',
                    title: 'No pending appointments',
                    message: "You don't have any pending appointments. Book a new appointment to get started!"
                };
            case 'completed':
                return {
                    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
                    iconColor: 'text-green-600',
                    title: 'No completed appointments',
                    message: "You don't have any completed appointments yet."
                };
            case 'cancelled':
                return {
                    gradient: 'bg-gradient-to-br from-red-100 to-rose-100',
                    iconColor: 'text-red-600',
                    title: 'No cancelled appointments',
                    message: "You don't have any cancelled appointments."
                };
            default:
                return {
                    gradient: 'bg-gradient-to-br from-sky-100 to-cyan-100',
                    iconColor: 'text-sky-600',
                    title: `No ${activeTab} appointments`,
                    message: `You don't have any ${activeTab} appointments yet.`
                };
        }
    };

    const config = getEmptyStateConfig();

    return (
        <div className="text-center py-16">
            <div className={`w-32 h-32 ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Calendar className={`w-16 h-16 ${config.iconColor}`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {config.title}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto text-lg">
                {config.message}
            </p>
        </div>
    );
};

export default EmptyState;
