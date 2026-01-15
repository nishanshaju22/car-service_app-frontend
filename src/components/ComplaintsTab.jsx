import React from 'react';
import { AlertCircle, TrendingDown, MessageSquare } from 'lucide-react';

const ComplaintsTab = ({ complaints, isLoading, error }) => {
  // Helper function to serialize values
  const serializeValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // For nested objects, try to get a meaningful representation
      if (Array.isArray(value)) return value.length > 0 ? `${value.length} items` : 'Empty';
      return Object.values(value).filter(v => v !== null && v !== undefined).join(', ') || 'N/A';
    }
    return String(value);
  };

  // Helper function to check if value should be highlighted
  const isHighlightedField = (value) => {
    return typeof value === 'number' && value > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-600" />
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

  if (!complaints || complaints.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-12 text-center">
        <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <p className="text-blue-800 font-medium">No complaints reported</p>
        <p className="text-blue-700 text-sm mt-1">This vehicle has no reported complaints</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint, index) => {
        // Count complaints per category (numeric values > 0)
        const complaintCount = Object.entries(complaint).filter(
          ([, value]) => typeof value === 'number' && value > 0
        ).length;

        return (
          <div
            key={index}
            className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Complaint Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    {complaintCount} complaint categor{complaintCount === 1 ? 'y' : 'ies'} reported
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(complaint).map(([key, value]) => {
                const isHighlighted = isHighlightedField(value);
                const serializedValue = serializeValue(value);

                return (
                  <div
                    key={key}
                    className={`rounded-lg p-4 flex items-center justify-between ${
                      isHighlighted ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                        {key
                          .replace(/_/g, ' ')
                          .replace(/([A-Z])/g, ' $1')
                          .trim()}
                      </p>
                      <p className="font-semibold text-gray-900 break-words">
                        {serializedValue}
                      </p>
                    </div>
                    {isHighlighted && (
                      <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintsTab;