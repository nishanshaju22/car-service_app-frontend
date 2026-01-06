import React from 'react';
import { MapPin, Calendar, Zap } from 'lucide-react';

const MaintenanceCard = ({ maintenance, statusColor }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{maintenance.serviceType}</h3>
          <p className="text-xs text-gray-600 mt-1">{maintenance.description}</p>
        </div>
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(
            maintenance.priority
          )}`}
        >
          {maintenance.priority?.charAt(0).toUpperCase() + maintenance.priority?.slice(1) || 'N/A'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Mileage</p>
            <p className="font-medium text-gray-900">{maintenance.scheduledMileage || maintenance.mileageAtService}km</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-medium text-gray-900">{formatDate(maintenance.serviceDate)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Cost</p>
          <p className="font-semibold text-gray-900">${maintenance.serviceCost || 'N/A'}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
          {maintenance.status || 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default MaintenanceCard;