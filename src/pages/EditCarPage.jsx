import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carApi } from '../api/carApi';

const EditCarPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const [originalCar, setOriginalCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarData();
  }, [id]);

  const fetchCarData = async () => {
    try {
      setFetchLoading(true);

      const car = await carApi.getCarById(id);
      if (!car) {
        setError('Car not found');
        return;
      }

      setOriginalCar(car);

      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year?.toString() || '',
        vin: car.vin || '',
        licensePlate: car.licensePlate || '',
        color: car.color || '',
        currentMileage: car.currentMileage?.toString() || '',
        mileageUnit: car.mileageUnit || 'km',
        purchaseDate: car.purchaseDate
          ? new Date(car.purchaseDate).toISOString().split('T')[0]
          : '',
        purchasePrice: car.purchasePrice?.toString() || '',
        purchaseMileage: car.purchaseMileage?.toString() || '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load car data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.make.trim()) return setError('Make is required'), false;
    if (!formData.model.trim()) return setError('Model is required'), false;
    if (!formData.year) return setError('Year is required'), false;
    if (!formData.currentMileage) return setError('Current mileage is required'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await carApi.updateCar(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update car');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

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
            Edit Vehicle
            </h1>
            <p className="text-white/80 text-sm">
            Update your vehicle details
            </p>
        </div>
        </div>


      <div className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Make *" name="make" value={formData.make} onChange={handleChange} />
              <Input label="Model *" name="model" value={formData.model} onChange={handleChange} />
              <Input
                label="Year *"
                name="year"
                type="number"
                min="1886"
                max={currentYear}
                value={formData.year}
                onChange={handleChange}
              />
              <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
            </div>
          </section>

          {/* Identification */}
          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-6">Identification</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="VIN" name="vin" value={formData.vin} onChange={handleChange} />
              <Input
                label="License Plate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Mileage */}
          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-6">Mileage</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Current Mileage *"
                name="currentMileage"
                type="number"
                value={formData.currentMileage}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Unit *</label>
                <select
                  name="mileageUnit"
                  value={formData.mileageUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="miles">Miles</option>
                </select>
              </div>
            </div>
          </section>

          {/* Purchase Info */}
          <section className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-6">Purchase Information</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
              <Input
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
              />
              <Input
                label="Purchase Mileage"
                name="purchaseMileage"
                type="number"
                value={formData.purchaseMileage}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable Input Component */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default EditCarPage;
