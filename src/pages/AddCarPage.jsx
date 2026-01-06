import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carApi } from '../api/carApi';

const AddCarPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const ACCENT = '#2C0703';

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    licensePlate: '',
    color: '',
    currentMileage: '',
    mileageUnit: 'km',
    purchaseDate: '',
    purchasePrice: '',
    purchaseMileage: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.make.trim()) {
      setError('Make is required');
      return false;
    }
    if (!formData.model.trim()) {
      setError('Model is required');
      return false;
    }
    if (!formData.year) {
      setError('Year is required');
      return false;
    }
    if (!formData.currentMileage) {
      setError('Current mileage is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await carApi.addCar(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div
        className="relative border-b px-10 pt-6 pb-6 flex items-center gap-6"
        style={{ backgroundColor: ACCENT }}
        >
        {/* Floating Back Button */}
        <button
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            aria-label="Go back"
        >
            <svg
            className="w-6 h-6"
            fill="none"
            stroke={ACCENT}
            viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
            />
            </svg>
        </button>

        {/* Header Text */}
        <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-white">
            Add New Vehicle
            </h1>
            <p className="text-white/80 text-sm">
            Enter your vehicle details to start tracking
            </p>
        </div>
        </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Alert */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  id="make"
                  name="make"
                  type="text"
                  required
                  value={formData.make}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Toyota"
                />
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Camry"
                />
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1886"
                  max={currentYear}
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={currentYear.toString()}
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Silver"
                />
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Identification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VIN */}
              <div>
                <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  id="vin"
                  name="vin"
                  type="text"
                  value={formData.vin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="17-character VIN"
                  maxLength="17"
                />
                <p className="text-xs text-gray-500 mt-1">Optional but recommended for tracking recalls</p>
              </div>

              {/* License Plate */}
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate
                </label>
                <input
                  id="licensePlate"
                  name="licensePlate"
                  type="text"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ABC-1234"
                />
              </div>
            </div>
          </div>

          {/* Mileage Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Mileage Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Mileage */}
              <div>
                <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Mileage <span className="text-red-500">*</span>
                </label>
                <input
                  id="currentMileage"
                  name="currentMileage"
                  type="number"
                  required
                  min="0"
                  value={formData.currentMileage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Mileage Unit */}
              <div>
                <label htmlFor="mileageUnit" className="block text-sm font-medium text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  id="mileageUnit"
                  name="mileageUnit"
                  value={formData.mileageUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="miles">Miles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Purchase Information</h2>
            <p className="text-sm text-gray-600 mb-6">Optional - helps track ownership history</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Purchase Date */}
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price
                </label>
                <input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Purchase Mileage */}
              <div>
                <label htmlFor="purchaseMileage" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Mileage
                </label>
                <input
                  id="purchaseMileage"
                  name="purchaseMileage"
                  type="number"
                  min="0"
                  value={formData.purchaseMileage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarPage;