export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getCategoryColor = (category) => {
    const colors = {
        'General Health': 'bg-blue-100 text-blue-800',
        'Cardiology': 'bg-red-100 text-red-800',
        'Neurology': 'bg-purple-100 text-purple-800',
        'Orthopedics': 'bg-green-100 text-green-800',
        'Pediatrics': 'bg-yellow-100 text-yellow-800',
        'Dermatology': 'bg-pink-100 text-pink-800',
        'Mental Health': 'bg-indigo-100 text-indigo-800',
        'Nutrition': 'bg-orange-100 text-orange-800',
        'Preventive Care': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
};

export const validateArticle = (title, content) => {
    const errors = [];
    
    if (!title.trim()) {
        errors.push('Title is required');
    } else if (title.length < 10) {
        errors.push('Title must be at least 10 characters long');
    }
    
    if (!content.trim()) {
        errors.push('Content is required');
    } else if (content.length < 50) {
        errors.push('Content must be at least 50 characters long');
    }
    
    return errors;
};
