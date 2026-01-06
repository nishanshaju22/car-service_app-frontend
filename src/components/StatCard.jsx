import React from 'react';

const StatCard = ({ title, count, subtitle, icon: Icon, accentColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{count}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon size={24} style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;