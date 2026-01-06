import React from 'react';
import MaintenanceCard from './MaintenanceCard';

const MaintenanceStatusSection = ({ title, maintenance, statusColor, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!maintenance || maintenance.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No {title.toLowerCase()} at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-700 bg-gray-100">
          {maintenance.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maintenance.map((item) => (
          <MaintenanceCard key={item.id} maintenance={item} statusColor={statusColor} />
        ))}
      </div>
    </div>
  );
};

export default MaintenanceStatusSection;
