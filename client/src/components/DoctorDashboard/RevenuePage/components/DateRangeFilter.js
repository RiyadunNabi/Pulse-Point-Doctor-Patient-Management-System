import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

/**
 * A custom hook to detect clicks outside a specified element.
 * This is used to close the date picker pop-up.
 */
const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or its descendants
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

function DateRangeFilter({ selectedRange, customRange, onRangeChange }) {
    const [showCustom, setShowCustom] = useState(false);
    // Local state to manage the date inputs before applying them
    const [localCustomRange, setLocalCustomRange] = useState({
        startDate: '',
        endDate: ''
    });
    
    // Create a ref for the entire component
    const filterRef = useRef(null);

    // Use the custom hook to close the pop-up when clicking outside
    useOnClickOutside(filterRef, () => setShowCustom(false));

    // Sync local state with props from the parent component
    useEffect(() => {
        setLocalCustomRange(customRange);
    }, [customRange]);

    // Handle selection of predefined ranges like "Today", "This Month", etc.
    const handlePredefinedRangeSelect = (rangeId) => {
        setShowCustom(false); // Close custom picker if it's open
        onRangeChange(rangeId);
    };
    
    // Update local state as user changes the date inputs
    const handleCustomDateChange = (e) => {
        setLocalCustomRange({ ...localCustomRange, [e.target.name]: e.target.value });
    };

    // When the user clicks "Apply" for the custom date range
    const handleCustomDateSubmit = () => {
        if (localCustomRange.startDate && localCustomRange.endDate) {
            onRangeChange('custom', localCustomRange);
            setShowCustom(false); // Close the pop-up after applying
        }
    };

    const predefinedRanges = [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'Last 7 Days' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' }
    ];
    
    return (
        // The ref is attached here to the root element
        <div className="relative" ref={filterRef}> 
            <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
                {predefinedRanges.map(range => (
                    <button
                        key={range.id}
                        onClick={() => handlePredefinedRangeSelect(range.id)}
                        className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${
                            selectedRange === range.id
                                ? 'bg-white text-sky-600 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {range.label}
                    </button>
                ))}
                <button
                    onClick={() => setShowCustom(!showCustom)} // Toggle the custom picker visibility
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 flex items-center space-x-2 ${
                        selectedRange === 'custom' || showCustom
                            ? 'bg-white text-sky-600 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Custom</span>
                </button>
            </div>
            
            {/* The pop-up for the custom date range picker */}
            {showCustom && (
                <div className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg shadow-xl border z-20 w-72">
                    <p className="text-sm font-medium text-slate-700 mb-3">Select a date range</p>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="startDate" className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={localCustomRange.startDate || ''}
                                onChange={handleCustomDateChange}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={localCustomRange.endDate || ''}
                                onChange={handleCustomDateChange}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleCustomDateSubmit}
                            className="bg-sky-600 text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateRangeFilter;
