import React from 'react';
import { Star, AlertCircle, TrendingUp } from 'lucide-react';

const RatingsTab = ({ ratings, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
        <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No ratings available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(rating).map(([key, value]) => (
              <div key={key} className="border-l-4 border-blue-600 pl-4">
                <p className="text-sm text-gray-600 mb-1 capitalize">
                  {key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()}
                </p>
                <div className="flex items-center gap-2">
                  {typeof value === 'number' && key.toLowerCase().includes('rating') ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">{value}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingsTab;