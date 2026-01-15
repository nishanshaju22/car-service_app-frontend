import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const RecallsTab = ({ recalls, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600" />
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

  if (!recalls || recalls.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="text-green-800 font-medium">No recalls found for this vehicle</p>
        <p className="text-green-700 text-sm mt-1">Your vehicle appears to be safe</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recalls.map((recall, index) => (
        <div
          key={index}
          className="bg-white border-2 border-red-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {Object.entries(recall).map(([key, value]) => {
                // Determine if this is a main title field
                const isTitle =
                  key.toLowerCase().includes('title') ||
                  key.toLowerCase().includes('name') ||
                  key.toLowerCase().includes('issue');

                if (isTitle) {
                  return (
                    <h3 key={key} className="text-lg font-bold text-gray-900 mb-3">
                      {value || 'Recall Issue'}
                    </h3>
                  );
                }

                return null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(recall).map(([key, value]) => {
              const isTitle =
                key.toLowerCase().includes('title') ||
                key.toLowerCase().includes('name') ||
                key.toLowerCase().includes('issue');

              if (isTitle) return null;

              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
                    {key
                      .replace(/_/g, ' ')
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecallsTab;