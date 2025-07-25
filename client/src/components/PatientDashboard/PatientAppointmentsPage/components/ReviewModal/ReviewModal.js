// import React, { useState, useEffect } from 'react';
// import { Star, User, Stethoscope, Edit3, Trash2 } from 'lucide-react';
// import axios from 'axios';
// import Modal from '../../../../shared/Modal'; // Import the shared Modal

// const ReviewModal = ({ isOpen, onClose, appointment, onReviewSubmitted }) => {
//     const [doctorInfo, setDoctorInfo] = useState(null);
//     const [existingReviews, setExistingReviews] = useState([]);
//     const [userReview, setUserReview] = useState(null);
//     const [rating, setRating] = useState(0);
//     const [hoverRating, setHoverRating] = useState(0);
//     const [reviewText, setReviewText] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [editMode, setEditMode] = useState(false);

//     // Fetch doctor info and reviews when modal opens
//     useEffect(() => {
//         if (isOpen && appointment?.appointment_id) {
//             fetchDoctorReviews();
//             checkExistingReview();
//         }
//     }, [isOpen, appointment]);

//     const fetchDoctorReviews = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`/api/reviews/doctor/${appointment.doctor_id}`);
//             setExistingReviews(response.data);
            
//             setDoctorInfo({
//                 name: `Dr. ${appointment.first_name} ${appointment.last_name}`,
//                 department: appointment.department_name,
//                 avgRating: calculateAverageRating(response.data)
//             });
//         } catch (error) {
//             console.error('Error fetching reviews:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const checkExistingReview = async () => {
//         try {
//             const existingReview = existingReviews.find(
//                 review => review.appointment_id === appointment.appointment_id
//             );
//             if (existingReview) {
//                 setUserReview(existingReview);
//                 setRating(existingReview.ratings);
//                 setReviewText(existingReview.review_text || '');
//             }
//         } catch (error) {
//             console.error('Error checking existing review:', error);
//         }
//     };

//     const calculateAverageRating = (reviews) => {
//         if (reviews.length === 0) return 0;
//         const sum = reviews.reduce((acc, review) => acc + review.ratings, 0);
//         return (sum / reviews.length).toFixed(1);
//     };

//     const handleSubmitReview = async (e) => {
//         e.preventDefault();
//         if (rating === 0) {
//             alert('Please select a rating');
//             return;
//         }

//         try {
//             setSubmitting(true);
//             if (userReview && editMode) {
//                 await axios.patch(`/api/reviews/${userReview.review_id}`, {
//                     ratings: rating,
//                     review_text: reviewText
//                 });
//             } else {
//                 await axios.post('/api/reviews', {
//                     appointment_id: appointment.appointment_id,
//                     ratings: rating,
//                     review_text: reviewText
//                 });
//             }
            
//             await fetchDoctorReviews();
//             setEditMode(false);
//             if (onReviewSubmitted) onReviewSubmitted();
            
//             alert(userReview && editMode ? 'Review updated successfully!' : 'Review submitted successfully!');
//         } catch (error) {
//             console.error('Error submitting review:', error);
//             alert('Failed to submit review. Please try again.');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleDeleteReview = async () => {
//         if (!userReview || !window.confirm('Are you sure you want to delete your review?')) return;

//         try {
//             await axios.delete(`/api/reviews/${userReview.review_id}`);
//             setUserReview(null);
//             setRating(0);
//             setReviewText('');
//             await fetchDoctorReviews();
//             alert('Review deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting review:', error);
//             alert('Failed to delete review. Please try again.');
//         }
//     };

//     const StarRating = ({ value, onChange, hover, onHover, readonly = false }) => (
//         <div className="flex space-x-1">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                     key={star}
//                     type="button"
//                     disabled={readonly}
//                     className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
//                     onClick={() => !readonly && onChange(star)}
//                     onMouseEnter={() => !readonly && onHover && onHover(star)}
//                     onMouseLeave={() => !readonly && onHover && onHover(0)}
//                 >
//                     <Star
//                         className={`w-6 h-6 transition-colors duration-200 ${
//                             star <= (hover || value)
//                                 ? 'fill-yellow-400 text-yellow-400'
//                                 : 'text-gray-300'
//                         }`}
//                     />
//                 </button>
//             ))}
//         </div>
//     );

//     return (
//         <Modal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Doctor Review & Ratings"
//             subtitle="Share your experience and view other patient reviews"
//             size="lg"
//         >
//             {loading ? (
//                 <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
//                     <span className="text-slate-600">Loading reviews...</span>
//                 </div>
//             ) : (
//                 <div className="space-y-6">
//                     {/* Doctor Info Card */}
//                     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm">
//                         <div className="flex items-center space-x-4">
//                             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
//                                 <Stethoscope className="w-8 h-8 text-white" />
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="text-xl font-bold text-slate-800">{doctorInfo?.name}</h3>
//                                 <p className="text-sm text-slate-600 mb-2">{doctorInfo?.department}</p>
//                                 <div className="flex items-center space-x-2">
//                                     <StarRating value={parseFloat(doctorInfo?.avgRating || 0)} readonly />
//                                     <span className="text-sm font-medium text-slate-700">
//                                         {doctorInfo?.avgRating} ({existingReviews.length} reviews)
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Review Form */}
//                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm">
//                         <div className="flex items-center justify-between mb-4">
//                             <h4 className="text-lg font-semibold text-slate-800">
//                                 {userReview ? (editMode ? 'Edit Your Review' : 'Your Review') : 'Write a Review'}
//                             </h4>
//                             {userReview && !editMode && (
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={() => setEditMode(true)}
//                                         className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                                     >
//                                         <Edit3 className="w-3 h-3" />
//                                         <span>Edit</span>
//                                     </button>
//                                     <button
//                                         onClick={handleDeleteReview}
//                                         className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                                     >
//                                         <Trash2 className="w-3 h-3" />
//                                         <span>Delete</span>
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {(!userReview || editMode) && (
//                             <form onSubmit={handleSubmitReview} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                                         Rating *
//                                     </label>
//                                     <StarRating
//                                         value={rating}
//                                         onChange={setRating}
//                                         hover={hoverRating}
//                                         onHover={setHoverRating}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                                         Review (Optional)
//                                     </label>
//                                     <textarea
//                                         value={reviewText}
//                                         onChange={(e) => setReviewText(e.target.value)}
//                                         placeholder="Share your experience with this doctor..."
//                                         rows={4}
//                                         className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                                     />
//                                 </div>

//                                 <div className="flex space-x-3">
//                                     <button
//                                         type="submit"
//                                         disabled={submitting || rating === 0}
//                                         className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
//                                     >
//                                         {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
//                                     </button>
//                                     {editMode && (
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setEditMode(false);
//                                                 setRating(userReview.ratings);
//                                                 setReviewText(userReview.review_text || '');
//                                             }}
//                                             className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-all duration-200"
//                                         >
//                                             Cancel
//                                         </button>
//                                     )}
//                                 </div>
//                             </form>
//                         )}

//                         {userReview && !editMode && (
//                             <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-300 shadow-sm">
//                                 <div className="flex items-center space-x-2 mb-2">
//                                     <StarRating value={userReview.ratings} readonly />
//                                     <span className="text-sm text-slate-600">
//                                         {new Date(userReview.created_at).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 {userReview.review_text && (
//                                     <p className="text-sm text-slate-700">{userReview.review_text}</p>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Other Reviews */}
//                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
//                         <h4 className="text-lg font-semibold text-slate-800 mb-4">
//                             Patient Reviews ({existingReviews.length})
//                         </h4>
                        
//                         {existingReviews.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <Star className="w-12 h-12 text-purple-300 mx-auto mb-3" />
//                                 <p className="text-slate-600">No reviews yet. Be the first to review!</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4 max-h-80 overflow-y-auto">
//                                 {existingReviews
//                                     .filter(review => review.appointment_id !== appointment.appointment_id)
//                                     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//                                     .map((review) => (
//                                         <div
//                                             key={review.review_id}
//                                             className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200 shadow-sm"
//                                         >
//                                             <div className="flex items-start justify-between mb-2">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                                                         <User className="w-4 h-4 text-white" />
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-medium text-slate-800">
//                                                             {review.first_name} {review.last_name}
//                                                         </p>
//                                                         <div className="flex items-center space-x-2">
//                                                             <StarRating value={review.ratings} readonly />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <span className="text-xs text-slate-500">
//                                                     {new Date(review.created_at).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                             {review.review_text && (
//                                                 <p className="text-sm text-slate-700 ml-11">
//                                                     {review.review_text}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </Modal>
//     );
// };

// export default ReviewModal;


// import React, { useState, useEffect } from 'react';
// import { Star, User, Stethoscope, Edit3, Trash2, Award, MessageSquare } from 'lucide-react';
// import axios from 'axios';
// import Modal from '../../../../shared/Modal';

// const ReviewModal = ({ isOpen, onClose, appointment, onReviewSubmitted }) => {
//     const [doctorInfo, setDoctorInfo] = useState(null);
//     const [existingReviews, setExistingReviews] = useState([]);
//     const [userReview, setUserReview] = useState(null);
//     const [rating, setRating] = useState(0);
//     const [hoverRating, setHoverRating] = useState(0);
//     const [reviewText, setReviewText] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [editMode, setEditMode] = useState(false);

//     // Fetch doctor info and reviews when modal opens
//     useEffect(() => {
//         if (isOpen && appointment?.appointment_id) {
//             fetchDoctorReviews();
//         }
//     }, [isOpen, appointment]);

//     // Check for existing review after reviews are loaded
//     useEffect(() => {
//         if (existingReviews.length > 0) {
//             checkExistingReview();
//         }
//     }, [existingReviews, appointment]);

//     const fetchDoctorReviews = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`/api/reviews/doctor/${appointment.doctor_id}`);
//             setExistingReviews(response.data);
            
//             setDoctorInfo({
//                 name: `Dr. ${appointment.first_name} ${appointment.last_name}`,
//                 department: appointment.department_name,
//                 avgRating: calculateAverageRating(response.data),
//                 totalReviews: response.data.length,
//                 ratingDistribution: calculateRatingDistribution(response.data)
//             });
//         } catch (error) {
//             console.error('Error fetching reviews:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const checkExistingReview = () => {
//         const existingReview = existingReviews.find(
//             review => review.appointment_id === appointment.appointment_id
//         );
//         if (existingReview) {
//             setUserReview(existingReview);
//             setRating(existingReview.ratings);
//             setReviewText(existingReview.review_text || '');
//         }
//     };

//     const calculateAverageRating = (reviews) => {
//         if (reviews.length === 0) return 0;
//         const sum = reviews.reduce((acc, review) => acc + review.ratings, 0);
//         return (sum / reviews.length).toFixed(1);
//     };

//     const calculateRatingDistribution = (reviews) => {
//         const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//         reviews.forEach(review => {
//             distribution[review.ratings] = (distribution[review.ratings] || 0) + 1;
//         });
//         return distribution;
//     };

//     const handleSubmitReview = async (e) => {
//         e.preventDefault();
//         if (rating === 0) {
//             alert('Please select a rating');
//             return;
//         }

//         try {
//             setSubmitting(true);
//             if (userReview && editMode) {
//                 await axios.patch(`/api/reviews/${userReview.review_id}`, {
//                     ratings: rating,
//                     review_text: reviewText
//                 });
//             } else {
//                 await axios.post('/api/reviews', {
//                     appointment_id: appointment.appointment_id,
//                     ratings: rating,
//                     review_text: reviewText
//                 });
//             }
            
//             await fetchDoctorReviews();
//             setEditMode(false);
//             if (onReviewSubmitted) onReviewSubmitted();
            
//             alert(userReview && editMode ? 'Review updated successfully!' : 'Review submitted successfully!');
//         } catch (error) {
//             console.error('Error submitting review:', error);
//             alert('Failed to submit review. Please try again.');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleDeleteReview = async () => {
//         if (!userReview || !window.confirm('Are you sure you want to delete your review?')) return;

//         try {
//             await axios.delete(`/api/reviews/${userReview.review_id}`);
//             setUserReview(null);
//             setRating(0);
//             setReviewText('');
//             await fetchDoctorReviews();
//             alert('Review deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting review:', error);
//             alert('Failed to delete review. Please try again.');
//         }
//     };

//     // Star rating component for interactive and display purposes
//     const StarRating = ({ value, onChange, hover, onHover, readonly = false, size = "w-6 h-6" }) => (
//         <div className="flex space-x-1">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                     key={star}
//                     type="button"
//                     disabled={readonly}
//                     className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
//                     onClick={() => !readonly && onChange && onChange(star)}
//                     onMouseEnter={() => !readonly && onHover && onHover(star)}
//                     onMouseLeave={() => !readonly && onHover && onHover(0)}
//                 >
//                     <Star
//                         className={`${size} transition-colors duration-200 ${
//                             star <= (hover || value)
//                                 ? 'fill-yellow-400 text-yellow-400'
//                                 : 'text-gray-300'
//                         }`}
//                     />
//                 </button>
//             ))}
//         </div>
//     );

//     // Rating distribution bar component
//     const renderRatingBar = (stars, count, total) => {
//         const percentage = total > 0 ? (count / total) * 100 : 0;
//         return (
//             <div className="flex items-center space-x-2 text-sm">
//                 <span className="w-8 text-slate-600">{stars}★</span>
//                 <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div
//                         className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${percentage}%` }}
//                     ></div>
//                 </div>
//                 <span className="w-8 text-slate-600 text-right">{count}</span>
//             </div>
//         );
//     };

//     return (
//         <Modal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Doctor Review & Ratings"
//             subtitle="Share your experience and view comprehensive patient feedback"
//             size="md"
//         >
//             {loading ? (
//                 <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mr-3"></div>
//                     <span className="text-slate-600">Loading reviews...</span>
//                 </div>
//             ) : (
//                 <div className="space-y-6">
//                     {/* Doctor Info Header */}
//                     <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm">
//                         <div className="flex items-center space-x-4">
//                             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
//                                 <Stethoscope className="w-8 h-8 text-white" />
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="text-xl font-bold text-slate-800">{doctorInfo?.name}</h3>
//                                 <p className="text-sm text-slate-600 mb-2">{doctorInfo?.department}</p>
//                             </div>
//                             <Award className="w-6 h-6 text-yellow-500" />
//                         </div>
//                     </div>

//                     {/* Overall Rating Summary - Adapted from RatingsSection */}
//                     <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
//                         <div className="flex items-center justify-between">
//                             <div className="text-center">
//                                 <div className="text-4xl font-bold text-yellow-600 mb-2">
//                                     {doctorInfo?.avgRating || '0.0'}
//                                 </div>
//                                 <div className="flex items-center justify-center space-x-1 mb-2">
//                                     <StarRating 
//                                         value={Math.floor(parseFloat(doctorInfo?.avgRating || 0))} 
//                                         readonly 
//                                         size="w-5 h-5"
//                                     />
//                                 </div>
//                                 <p className="text-sm text-slate-600">
//                                     {doctorInfo?.totalReviews || 0} reviews
//                                 </p>
//                             </div>
                            
//                             <div className="flex-1 ml-8">
//                                 <div className="space-y-2">
//                                     {[5, 4, 3, 2, 1].map(stars => 
//                                         renderRatingBar(
//                                             stars, 
//                                             doctorInfo?.ratingDistribution?.[stars] || 0, 
//                                             doctorInfo?.totalReviews || 0
//                                         )
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Review Form Section */}
//                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm">
//                         <div className="flex items-center justify-between mb-4">
//                             <h4 className="text-lg font-semibold text-slate-800 flex items-center">
//                                 <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
//                                 {userReview ? (editMode ? 'Edit Your Review' : 'Your Review') : 'Write a Review'}
//                             </h4>
//                             {userReview && !editMode && (
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={() => setEditMode(true)}
//                                         className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                                     >
//                                         <Edit3 className="w-3 h-3" />
//                                         <span>Edit</span>
//                                     </button>
//                                     <button
//                                         onClick={handleDeleteReview}
//                                         className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                                     >
//                                         <Trash2 className="w-3 h-3" />
//                                         <span>Delete</span>
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {(!userReview || editMode) && (
//                             <form onSubmit={handleSubmitReview} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                                         Rating *
//                                     </label>
//                                     <StarRating
//                                         value={rating}
//                                         onChange={setRating}
//                                         hover={hoverRating}
//                                         onHover={setHoverRating}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                                         Review (Optional)
//                                     </label>
//                                     <textarea
//                                         value={reviewText}
//                                         onChange={(e) => setReviewText(e.target.value)}
//                                         placeholder="Share your experience with this doctor..."
//                                         rows={4}
//                                         className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                                     />
//                                 </div>

//                                 <div className="flex space-x-3">
//                                     <button
//                                         type="submit"
//                                         disabled={submitting || rating === 0}
//                                         className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
//                                     >
//                                         {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
//                                     </button>
//                                     {editMode && (
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setEditMode(false);
//                                                 setRating(userReview.ratings);
//                                                 setReviewText(userReview.review_text || '');
//                                             }}
//                                             className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-all duration-200"
//                                         >
//                                             Cancel
//                                         </button>
//                                     )}
//                                 </div>
//                             </form>
//                         )}

//                         {userReview && !editMode && (
//                             <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-300 shadow-sm">
//                                 <div className="flex items-center space-x-2 mb-2">
//                                     <StarRating value={userReview.ratings} readonly size="w-4 h-4" />
//                                     <span className="text-sm text-slate-600">
//                                         {new Date(userReview.created_at).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 {userReview.review_text && (
//                                     <p className="text-sm text-slate-700">{userReview.review_text}</p>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Recent Reviews Section - Adapted from RatingsSection */}
//                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-sm">
//                         <h4 className="text-lg font-semibold text-slate-700 mb-4">Recent Reviews</h4>
                        
//                         {existingReviews.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <Star className="w-12 h-12 text-purple-300 mx-auto mb-3" />
//                                 <p className="text-slate-600">No reviews yet. Be the first to review!</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4 max-h-80 overflow-y-auto">
//                                 {existingReviews
//                                     .filter(review => review.appointment_id !== appointment.appointment_id)
//                                     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//                                     .slice(0, 5) // Show only 5 recent reviews
//                                     .map((review) => (
//                                         <div key={review.review_id} className="border border-slate-200 rounded-lg p-4 bg-white/70 backdrop-blur-sm shadow-sm">
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <div className="flex items-center space-x-2">
//                                                     <span className="font-medium text-slate-700">
//                                                         {review.first_name} {review.last_name}
//                                                     </span>
//                                                     <div className="flex items-center space-x-1">
//                                                         <StarRating value={review.ratings} readonly size="w-4 h-4" />
//                                                     </div>
//                                                 </div>
//                                                 <span className="text-sm text-slate-500">
//                                                     {new Date(review.created_at).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                             {review.review_text && (
//                                                 <p className="text-slate-600 text-sm">{review.review_text}</p>
//                                             )}
//                                         </div>
//                                     ))}
//                             </div>
//                         )}

//                         {existingReviews.length > 5 && (
//                             <button className="w-full mt-4 px-4 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors text-sm font-medium">
//                                 View All {existingReviews.length} Reviews
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </Modal>
//     );
// };

// export default ReviewModal;








import React, { useState, useEffect } from 'react';
import { Star, User, Stethoscope, Edit3, Trash2, Award, MessageSquare } from 'lucide-react';
import axios from 'axios';
import Modal from '../../../../shared/Modal';

const ReviewModal = ({ isOpen, onClose, appointment, onReviewSubmitted }) => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [existingReviews, setExistingReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Fetch doctor info and reviews when modal opens
    useEffect(() => {
        if (isOpen && appointment?.appointment_id) {
            fetchDoctorReviews();
        }
    }, [isOpen, appointment]);

    // Check for existing review after reviews are loaded
    useEffect(() => {
        if (existingReviews.length > 0) {
            checkExistingReview();
        }
    }, [existingReviews, appointment]);

    const fetchDoctorReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/reviews/doctor/${appointment.doctor_id}`);
            setExistingReviews(response.data);
            
            setDoctorInfo({
                name: `Dr. ${appointment.first_name} ${appointment.last_name}`,
                department: appointment.department_name,
                avgRating: calculateAverageRating(response.data),
                totalReviews: response.data.length,
                ratingDistribution: calculateRatingDistribution(response.data)
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkExistingReview = () => {
        const existingReview = existingReviews.find(
            review => review.appointment_id === appointment.appointment_id
        );
        if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.ratings);
            setReviewText(existingReview.review_text || '');
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.ratings, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const calculateRatingDistribution = (reviews) => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.ratings] = (distribution[review.ratings] || 0) + 1;
        });
        return distribution;
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        try {
            setSubmitting(true);
            if (userReview && editMode) {
                await axios.patch(`/api/reviews/${userReview.review_id}`, {
                    ratings: rating,
                    review_text: reviewText
                });
            } else {
                await axios.post('/api/reviews', {
                    appointment_id: appointment.appointment_id,
                    ratings: rating,
                    review_text: reviewText
                });
            }
            
            await fetchDoctorReviews();
            setEditMode(false);
            if (onReviewSubmitted) onReviewSubmitted();
            
            alert(userReview && editMode ? 'Review updated successfully!' : 'Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview || !window.confirm('Are you sure you want to delete your review?')) return;

        try {
            await axios.delete(`/api/reviews/${userReview.review_id}`);
            setUserReview(null);
            setRating(0);
            setReviewText('');
            await fetchDoctorReviews();
            alert('Review deleted successfully!');
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review. Please try again.');
        }
    };

    // Star rating component for interactive and display purposes
    const StarRating = ({ value, onChange, hover, onHover, readonly = false, size = "w-4 h-4" }) => (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                    onClick={() => !readonly && onChange && onChange(star)}
                    onMouseEnter={() => !readonly && onHover && onHover(star)}
                    onMouseLeave={() => !readonly && onHover && onHover(0)}
                >
                    <Star
                        className={`${size} transition-colors duration-200 ${
                            star <= (hover || value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );

    // Rating distribution bar component
    const renderRatingBar = (stars, count, total) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
            <div className="flex items-center space-x-2 text-xs">
                <span className="w-6 text-slate-600 text-xs">{stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="w-6 text-slate-600 text-right text-xs">{count}</span>
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Doctor Review & Ratings"
            subtitle="Share your experience and view comprehensive patient feedback"
            size="md"
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 mr-2"></div>
                    <span className="text-slate-600 text-xs">Loading reviews...</span>
                </div>
            ) : (
                <div className="space-y-4 relative z-10">
                    {/* Doctor Info Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-slate-800">{doctorInfo?.name}</h3>
                                <p className="text-xs text-slate-600">{doctorInfo?.department}</p>
                            </div>
                            <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                    </div>

                    {/* Overall Rating Summary */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600 mb-1">
                                    {doctorInfo?.avgRating || '0.0'}
                                </div>
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                    <StarRating 
                                        value={Math.floor(parseFloat(doctorInfo?.avgRating || 0))} 
                                        readonly 
                                        size="w-4 h-4"
                                    />
                                </div>
                                <p className="text-xs text-slate-600">
                                    {doctorInfo?.totalReviews || 0} reviews
                                </p>
                            </div>
                            
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map(stars => 
                                    renderRatingBar(
                                        stars, 
                                        doctorInfo?.ratingDistribution?.[stars] || 0, 
                                        doctorInfo?.totalReviews || 0
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Review Form Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-slate-800 flex items-center">
                                <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                                {userReview ? (editMode ? 'Edit Your Review' : 'Your Review') : 'Write a Review'}
                            </h4>
                            {userReview && !editMode && (
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={handleDeleteReview}
                                        className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {(!userReview || editMode) && (
                            <form onSubmit={handleSubmitReview} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Rating *
                                    </label>
                                    <StarRating
                                        value={rating}
                                        onChange={setRating}
                                        hover={hoverRating}
                                        onHover={setHoverRating}
                                        size="w-5 h-5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Review (Optional)
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your experience with this doctor..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-xs"
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0}
                                        className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                    >
                                        {submitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                                    </button>
                                    {editMode && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditMode(false);
                                                setRating(userReview.ratings);
                                                setReviewText(userReview.review_text || '');
                                            }}
                                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}

                        {userReview && !editMode && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-green-300 shadow-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                    <StarRating value={userReview.ratings} readonly size="w-3 h-3" />
                                    <span className="text-xs text-slate-600">
                                        {new Date(userReview.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {userReview.review_text && (
                                    <p className="text-xs text-slate-700">{userReview.review_text}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Reviews Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Reviews</h4>
                        
                        {existingReviews.length === 0 ? (
                            <div className="text-center py-6">
                                <Star className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                                <p className="text-slate-600 text-xs">No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {existingReviews
                                    .filter(review => review.appointment_id !== appointment.appointment_id)
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .slice(0, 5)
                                    .map((review) => (
                                        <div key={review.review_id} className="border border-slate-200 rounded-lg p-3 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-slate-700 text-xs">
                                                        {review.first_name} {review.last_name}
                                                    </span>
                                                    <StarRating value={review.ratings} readonly size="w-3 h-3" />
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.review_text && (
                                                <p className="text-slate-600 text-xs">{review.review_text}</p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {existingReviews.length > 5 && (
                            <button className="w-full mt-3 px-3 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors text-xs font-medium">
                                View All {existingReviews.length} Reviews
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ReviewModal;
