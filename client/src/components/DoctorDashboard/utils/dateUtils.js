export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const getStatusBadge = (status) => {
    const statusConfig = {
        pending: { 
            bg: 'bg-gradient-to-r from-amber-100 to-orange-100', 
            text: 'text-amber-800', 
            border: 'border-amber-200',
            label: 'Pending',
            icon: '⏳'
        },
        completed: { 
            bg: 'bg-gradient-to-r from-green-100 to-emerald-100', 
            text: 'text-green-800', 
            border: 'border-green-200',
            label: 'Completed',
            icon: '✅'
        },
        cancelled: { 
            bg: 'bg-gradient-to-r from-red-100 to-rose-100', 
            text: 'text-red-800', 
            border: 'border-red-200',
            label: 'Cancelled',
            icon: '❌'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </span>
    );
};
