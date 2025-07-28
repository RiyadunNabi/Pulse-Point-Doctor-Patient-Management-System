// import React from 'react';
// import { Star, MessageSquare, TrendingUp, Award } from 'lucide-react';

// function RatingsSection({ ratingsData, doctorId }) {
//     // Mock data - replace with actual data from ratingsData
//     const mockRatings = {
//         averageRating: 4.7,
//         totalReviews: 156,
//         ratingDistribution: {
//             5: 89,
//             4: 45,
//             3: 15,
//             2: 5,
//             1: 2
//         },
//         recentReviews: [
//             {
//                 id: 1,
//                 patientName: "Sarah Johnson",
//                 rating: 5,
//                 comment: "Excellent doctor! Very thorough and caring.",
//                 date: "2024-01-15"
//             },
//             {
//                 id: 2,
//                 patientName: "Michael Chen",
//                 rating: 4,
//                 comment: "Great experience, would recommend.",
//                 date: "2024-01-14"
//             },
//             {
//                 id: 3,
//                 patientName: "Emily Davis",
//                 rating: 5,
//                 comment: "Professional and knowledgeable. Thank you!",
//                 date: "2024-01-13"
//             }
//         ]
//     };

//     const renderStars = (rating) => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <Star
//                 key={i}
//                 className={`w-4 h-4 ${
//                     i < rating 
//                         ? 'text-yellow-500 fill-current' 
//                         : 'text-gray-300'
//                 }`}
//             />
//         ));
//     };

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
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
//             <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-slate-800">Ratings & Reviews</h3>
//                 <Award className="w-5 h-5 text-yellow-500" />
//             </div>

//             {/* Overall Rating Summary */}
//             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
//                 <div className="flex items-center justify-between">
//                     <div className="text-center">
//                         <div className="text-4xl font-bold text-yellow-600 mb-2">
//                             {mockRatings.averageRating}
//                         </div>
//                         <div className="flex items-center justify-center space-x-1 mb-2">
//                             {renderStars(Math.floor(mockRatings.averageRating))}
//                         </div>
//                         <p className="text-sm text-slate-600">
//                             {mockRatings.totalReviews} reviews
//                         </p>
//                     </div>
                    
//                     <div className="flex-1 ml-8">
//                         <div className="space-y-2">
//                             {[5, 4, 3, 2, 1].map(stars => 
//                                 renderRatingBar(
//                                     stars, 
//                                     mockRatings.ratingDistribution[stars], 
//                                     mockRatings.totalReviews
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Reviews */}
//             <div>
//                 <h4 className="text-lg font-semibold text-slate-700 mb-4">Recent Reviews</h4>
//                 <div className="space-y-4">
//                     {mockRatings.recentReviews.map(review => (
//                         <div key={review.id} className="border border-slate-200 rounded-lg p-4">
//                             <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center space-x-2">
//                                     <span className="font-medium text-slate-700">
//                                         {review.patientName}
//                                     </span>
//                                     <div className="flex items-center space-x-1">
//                                         {renderStars(review.rating)}
//                                     </div>
//                                 </div>
//                                 <span className="text-sm text-slate-500">
//                                     {new Date(review.date).toLocaleDateString()}
//                                 </span>
//                             </div>
//                             <p className="text-slate-600 text-sm">{review.comment}</p>
//                         </div>
//                     ))}
//                 </div>
                
//                 <button className="w-full mt-4 px-4 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors text-sm font-medium">
//                     View All Reviews
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default RatingsSection;


import React from 'react';
import { Star, Award } from 'lucide-react';

function RatingsSection({ ratingsData = [] }) {
    if (ratingsData.length === 0) {
        return <p className="text-sm text-slate-500">No reviews yet.</p>;
    }

    // 1) Total & average
    const totalReviews = ratingsData.length;
    const averageRating =
      ratingsData.reduce((sum, r) => sum + (r.ratings || 0), 0) / totalReviews;

    // 2) Distribution
    const ratingDistribution = [5,4,3,2,1].reduce((acc, star) => {
        acc[star] = ratingsData.filter(r => r.ratings === star).length;
        return acc;
    }, {});

    // 3) Recent 3 reviews
    const recentReviews = [...ratingsData]
      .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0,3)
      .map(r => ({
        id: r.review_id,
        patientName: `${r.first_name} ${r.last_name}`,
        rating: r.ratings,
        comment: r.review_text,
        date: r.created_at
      }));

    const renderStars = rating =>
      Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
          }`}
        />
      ));

    const renderRatingBar = stars => {
      const count = ratingDistribution[stars] || 0;
      const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return (
        <div className="flex items-center space-x-2 text-sm" key={stars}>
          <span className="w-8">{stars}★</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="w-8 text-right">{count}</span>
        </div>
      );
    };

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Ratings & Reviews</h3>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>

        {/* Overall Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-slate-600">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            <div className="flex-1 ml-8 space-y-2">
              {[5,4,3,2,1].map(renderRatingBar)}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-4">
            Recent Reviews
          </h4>
          <div className="space-y-4">
            {recentReviews.map(r => (
              <div key={r.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-700">
                      {r.patientName}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(r.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg text-sm font-medium">
            View All Reviews
          </button>
        </div>
      </div>
    );
}

export default RatingsSection;
