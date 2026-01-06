import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carApi } from '../api/carApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelectedCar } from '../context/SelectedCarContext';
import { AlertCircle, Wrench, DollarSign, Calendar, Gauge, FileText } from 'lucide-react';

function timeSincePurchase(purchaseDate) {
  if (!purchaseDate) return 'N/A';

  const purchase = new Date(purchaseDate);
  const now = new Date();

  let years = now.getFullYear() - purchase.getFullYear();
  let months = now.getMonth() - purchase.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years === 0 && months === 0) return 'Less than a month';

  let result = '';
  if (years > 0) result += `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) result += (years > 0 ? ', ' : '') + `${months} month${months > 1 ? 's' : ''}`;
  return result;
}

const CarInfoPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { setSelectedCar } = useSelectedCar();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await carApi.getCarById(carId);
      setCar(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load car details');
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCar = () => {
    setSelectedCar(car);
    navigate('/maintenance');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMileage = (mileage, unit) =>
    mileage ? `${mileage.toLocaleString()} ${unit || 'km'}` : 'N/A';

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2C0703]" />
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error || !car) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Car</h2>
            <p className="text-slate-600 mb-6">{error || 'Car not found'}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={fetchCarDetails}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 pb-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/cars/edit/${carId}`)}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Car Image */}
          <div className="relative w-full h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
            {car.img ? (
              <img
                src={car.img}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-slate-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Card */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {car.make} {car.model}
                </h1>
                <p className="text-xl text-slate-600 mb-4">Year: {car.year}</p>

                <div className="w-12 h-[2px] bg-[#2C0703] opacity-50 mb-6" />

                <div className="grid grid-cols-2 gap-4">
                  {car.color && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Color</p>
                      <p className="font-semibold text-slate-900">{car.color}</p>
                    </div>
                  )}
                  {car.licensePlate && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">License Plate</p>
                      <p className="font-semibold text-slate-900">{car.licensePlate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Identification */}
              {car.vin && (
                <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Vehicle Identification</h2>
                  </div>
                  <div className="w-12 h-[2px] bg-[#2C0703] opacity-50 mb-4" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">VIN (Vehicle Identification Number)</p>
                    <p className="font-mono font-semibold text-slate-900 text-lg break-all">{car.vin}</p>
                  </div>
                </div>
              )}

              {/* Mileage Information */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Gauge className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-slate-900">Mileage Information</h2>
                </div>
                <div className="w-12 h-[2px] bg-[#2C0703] opacity-50 mb-4" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Current Mileage</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatMileage(car.currentMileage, car.mileageUnit)}
                    </p>
                  </div>
                  {car.purchaseMileage !== null && car.purchaseMileage !== undefined && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Mileage at Purchase</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatMileage(car.purchaseMileage, car.mileageUnit)}
                      </p>
                    </div>
                  )}
                </div>

                {car.currentMileage && car.purchaseMileage && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">Total Distance Traveled</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatMileage(car.currentMileage - car.purchaseMileage, car.mileageUnit)}
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase Information */}
              {car.purchaseDate && car.purchasePrice ? (
                    <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-slate-900">Purchase Information</h2>
                        </div>
                        <div className="w-12 h-[2px] bg-[#2C0703] opacity-50 mb-4" />

                        <div className="grid grid-cols-2 gap-6">
                        {car.purchaseDate && (
                            <div>
                            <p className="text-sm text-slate-500 mb-1">Purchase Date</p>
                            <p className="font-semibold text-slate-900">{formatDate(car.purchaseDate)}</p>
                            <p className="text-sm text-slate-600 mt-1">
                                {timeSincePurchase(car.purchaseDate)} ago
                            </p>
                            </div>
                        )}
                        {car.purchasePrice && (
                            <div>
                            <p className="text-sm text-slate-500 mb-1">Purchase Price</p>
                            <p className="text-2xl font-bold text-slate-900">
                                ${car.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            </div>
                        )}
                        </div>
                    </div>
                ) : (
                    <div>

                    </div>
                )}
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Select Button */}
              <button
                onClick={handleSelectCar}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Wrench className="w-5 h-5" />
                View Maintenance
              </button>

              {/* Timestamps */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Created</p>
                  <p className="font-medium text-slate-900">{formatDate(car.createdAt)}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Last Updated</p>
                  <p className="font-medium text-slate-900">{formatDate(car.updatedAt)}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-100 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600">Car Age</p>
                    <p className="font-semibold text-slate-900">
                      {timeSincePurchase(car.purchaseDate)}
                    </p>
                  </div>
                </div>

                {car.currentMileage ? (
                  <div className="flex items-start gap-3">
                    <Gauge className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Current Mileage</p>
                      <p className="font-semibold text-slate-900">
                        {car.currentMileage.toLocaleString()} {car.mileageUnit}
                      </p>
                    </div>
                  </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <Gauge className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-slate-600">Current Mileage</p>
                            <p className="font-semibold text-slate-900">
                                N.A
                            </p>
                        </div>
                    </div>
                )}

                {car.purchasePrice ? (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Purchase Price</p>
                      <p className="font-semibold text-slate-900">
                        ${car.purchasePrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                ): (
                    <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-slate-600">Purchase Price</p>
                            <p className="font-semibold text-slate-900">
                                N.A
                            </p>
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CarInfoPage;