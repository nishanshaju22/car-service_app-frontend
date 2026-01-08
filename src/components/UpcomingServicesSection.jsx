import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { maintenanceApi } from '../api/maintainanseApi';

const UpcomingServicesSection = ({ currentMileage, mileageUnit = 'km' }) => {
  const [amount, setAmount] = useState(2);
  const [upcomingData, setUpcomingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchUpcomingServices();
  }, [amount]);

  const fetchUpcomingServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await maintenanceApi.getUpcomingServices(currentMileage, amount);
      setUpcomingData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch upcoming services');
      setUpcomingData([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'recommended':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'optional':
        return <Zap className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'recommended':
        return 'bg-yellow-50 border-yellow-200';
      case 'optional':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getProgressColor = (distanceToService) => {
    if (distanceToService <= 500) return 'bg-red-600';
    if (distanceToService <= 1000) return 'bg-yellow-600';
    if (distanceToService <= 2000) return 'bg-blue-600';
    return 'bg-gray-400';
  };

  const calculateDaysUntil = (daysAtService, daysSinceManufacture) => {
    if (!daysAtService || !daysSinceManufacture) return null;
    return daysAtService - daysSinceManufacture;
  };

  const calculateDistanceRemaining = (serviceDistance, currentDistance) => {
    const remaining = serviceDistance - currentDistance;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Services</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">Show next</label>
          <select
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            <option value={1}>1 service</option>
            <option value={2}>2 services</option>
            <option value={3}>3 services</option>
            <option value={4}>4 services</option>
            <option value={5}>5 services</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && upcomingData.length === 0 && !error && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No upcoming services scheduled</p>
        </div>
      )}

      {/* Services List */}
      {!loading && upcomingData.length > 0 && (
        <div className="space-y-4">
          {upcomingData.map((serviceGroup, groupIndex) => {
            const mileageKey = mileageUnit === 'miles' ? 'miles' : 'kilometers';
            const serviceDistance = serviceGroup[mileageKey];
            const distanceRemaining = calculateDistanceRemaining(serviceDistance, currentMileage);
            const progressPercent = Math.min(
              ((currentMileage / serviceDistance) * 100),
              100
            );

            return (
              <div key={groupIndex}>
                {/* Service Group Header */}
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === groupIndex ? null : groupIndex)
                  }
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {/* Mileage Milestone */}
                      <div className="flex-shrink-0">
                        <p className="text-sm text-gray-600">Next Service At</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {serviceDistance.toLocaleString()} {mileageUnit}
                        </p>
                      </div>

                      {/* Progress Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {distanceRemaining.toLocaleString()} {mileageUnit} remaining
                          </span>
                          <span className="text-sm text-gray-600">
                            {Math.round(progressPercent)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(
                              distanceRemaining
                            )}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Service Count */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-gray-600">Services</p>
                        <p className="text-xl font-bold text-gray-900">
                          {serviceGroup.services.length}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Icon */}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform ml-4 ${
                        expandedIndex === groupIndex ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Services List */}
                {expandedIndex === groupIndex && (
                  <div className="border border-t-0 border-gray-200 rounded-b-xl p-4 bg-gray-50 space-y-3">
                    {serviceGroup.services.map((service) => (
                      <div
                        key={service.id}
                        className={`border rounded-lg p-4 ${getPriorityColor(service.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Priority Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getPriorityIcon(service.priority)}
                          </div>

                          {/* Service Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {service.name}
                                </h4>
                                <p className="text-sm text-gray-700 mb-2">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-gray-700">
                                    {service.category}
                                  </span>
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-gray-700 capitalize">
                                    {service.priority}
                                  </span>
                                </div>
                              </div>

                              {/* Cost */}
                              <div className="flex-shrink-0 text-right">
                                <p className="text-xs text-gray-600 mb-1">Est. Cost</p>
                                <p className="text-lg font-bold text-gray-900">
                                  ${service.estimatedCost.min} - ${service.estimatedCost.max}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Service Group Summary */}
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total Estimated Cost:</span>
                        <span className="text-lg font-bold text-gray-900">
                          $
                          {Math.min(
                            ...serviceGroup.services.map((s) => s.estimatedCost.min)
                          )}
                          -
                          $
                          {Math.max(
                            ...serviceGroup.services.map((s) => s.estimatedCost.max)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingServicesSection;
