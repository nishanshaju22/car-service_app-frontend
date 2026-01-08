import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Slash } from 'lucide-react';

const MaintenanceTable = ({ maintenance, isLoading, error }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'SCHEDULED':
                return <Clock className="w-5 h-5 text-blue-600" />;
            case 'OVERDUE':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'SKIPPED':
                return <Slash className="w-5 h-5 text-gray-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-50 text-green-700';
            case 'SCHEDULED':
                return 'bg-blue-50 text-blue-700';
            case 'OVERDUE':
                return 'bg-red-50 text-red-700';
            case 'SKIPPED':
                return 'bg-gray-50 text-gray-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical':
                return 'text-red-600 font-semibold';
            case 'high':
                return 'text-orange-600 font-semibold';
            case 'medium':
                return 'text-yellow-600 font-semibold';
            case 'low':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-EU', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl border border-red-200 p-6">
                <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium">Failed to load maintenance data</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!maintenance || maintenance.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-center py-8">
                <p className="text-gray-500 font-medium">No maintenance records found</p>
                </div>
            </div>
        );
    }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Service Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Surviced At
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Recommended Mileage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Cost
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {item.serviceType}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                    {item.category || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${getPriorityColor(item.priority)}`}>
                    {item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 font-medium">
                    {item.mileageAtService || 'N/A'} km
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 font-medium">
                    {item.scheduledMileage || 'N/A'} km
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">
                    {formatDate(item.scheduledDate ? item.scheduledDate : item.serviceDate)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ${item.serviceCost || 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status || 'N/A'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;
