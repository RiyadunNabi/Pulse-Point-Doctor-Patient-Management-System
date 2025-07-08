// client/src/components/Booking/PatientBookingModal.js

const PatientBookingModal = ({ doctorId, isOpen, onClose, onBookingSuccess }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch available slots (same as doctor dashboard)
    const fetchAvailableSlots = async () => {
        try {
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const response = await axios.get(`/api/schedule/available/${doctorId}`, {
                params: { startDate, endDate }
            });
            setAvailableSlots(response.data);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        }
    };

    // Group slots by date (same logic as doctor dashboard)
    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const date = slot.slot_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});
};
