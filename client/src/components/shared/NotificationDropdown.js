import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import axios from '../../utils/axiosConfig'

const NotificationDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    //   const [open, setOpen] = useState(false);

    //fetch badge count immediately on mount
    useEffect(() => {
        // axios
        //   .get('/api/notifications/unread-count')
        //   .then(({ data }) => setUnreadCount(data.count))
        //   .catch(console.error);
        if (!user) return;
        const userType = user.role === 'doctor' ? 'doctor' : 'patient';
        const userId = user.role === 'doctor' ? user.doctor_id : user.patient_id;

        axios
            .get(`/api/notifications/${userType}/${userId}/unread-count`)
            .then(({ data }) => setUnreadCount(data.count))
            .catch(console.error);
    }, []);

    const toggle = async () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);
        if (willOpen) {
            // re-fetch badge count when opening
            // const { data } = await axios.get('/api/notifications/unread-count');
            // setUnreadCount(data.count);
            const userType = user.role === 'doctor' ? 'doctor' : 'patient';
            const userId = user.role === 'doctor' ? user.doctor_id : user.patient_id;

            const { data } = await axios.get(
                `/api/notifications/${userType}/${userId}/unread-count`
            );
            setUnreadCount(data.count);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen && user) {
            fetchNotifications();
        }
    }, [isOpen, user]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const userType = user.role === 'doctor' ? 'doctor' : 'patient';
            const userId = user.role === 'doctor' ? user.doctor_id : user.patient_id;

            const response = await axios.get(`/api/notifications/${userType}/${userId}`);
            const allNotifications = response.data;

            // Get unread notifications
            const unread = allNotifications.filter(n => !n.is_read);
            const read = allNotifications.filter(n => n.is_read);

            // Show up to 10 notifications (prioritize unread)
            const displayNotifications = [
                ...unread,
                ...read.slice(0, Math.max(0, 10 - unread.length))
            ].slice(0, 10);

            setNotifications(displayNotifications);
            setUnreadCount(unread.length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/api/notifications/${notificationId}`);

            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.notification_id === notificationId
                        ? { ...n, is_read: true }
                        : n
                )
            );

            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications
                .filter(n => !n.is_read)
                .map(n => n.notification_id);

            if (unreadIds.length === 0) return;

            await Promise.all(
                unreadIds.map(id => axios.patch(`/api/notifications/${id}`))
            );

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell */}
            <button
                onClick={toggle}
                className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-sky-600 hover:text-sky-800 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-80">
                        {loading ? (
                            <div className="p-4 text-center text-slate-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 mx-auto"></div>
                                <p className="mt-2 text-sm">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.notification_id}
                                        className={`p-4 hover:bg-slate-50 transition-colors ${!notification.is_read ? 'bg-sky-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-medium text-slate-800 truncate">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.is_read && (
                                                        <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {formatTimeAgo(notification.time)}
                                                </p>
                                            </div>

                                            {!notification.is_read && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification.notification_id);
                                                    }}
                                                    className="ml-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
                            <button className="text-xs text-slate-600 hover:text-slate-800 w-full text-center">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
