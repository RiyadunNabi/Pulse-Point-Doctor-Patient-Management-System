export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const getStatusBadge = (status) => {
    const statusConfig = {
        pending: { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
        completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
        cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};
