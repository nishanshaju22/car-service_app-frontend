import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Star } from 'lucide-react';
import { carIssuesApi } from '../api/carIssuesApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelectedCar } from '../context/SelectedCarContext';
import RatingsTab from '../components/RatingsTab';
import RecallsTab from '../components/RecallsTab';
import ComplaintsTab from '../components/ComplaintsTab';
import { carApi } from '../api/carApi';

const CarIssuesPage = () => {
  const navigate = useNavigate();
  const ACCENT = '#2C0703';
  const { selectedCar, setSelectedCar } = useSelectedCar();

  const [activeTab, setActiveTab] = useState('recalls');
  const [ratings, setRatings] = useState([]);
  const [recalls, setRecalls] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    ratings: true,
    recalls: true,
    complaints: true,
  });

  const [errorStates, setErrorStates] = useState({
    ratings: '',
    recalls: '',
    complaints: '',
  });

  const [carsLoading, setCarsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [carsError, setCarsError] = useState('');

  useEffect(() => {
    if (!selectedCar?.id) {
      // Fetch available cars if none selected
      fetchAvailableCars();
    } else {
      // Fetch all data for selected car
      fetchAllData();
    }
  }, [selectedCar?.id]);

  const fetchAvailableCars = async () => {
    setCarsLoading(true);
    setCarsError('');
    try {
      const data = await carApi.getCars();
      setCars(Array.isArray(data.cars) ? data.cars : []);
    } catch (err) {
      setCarsError(err.response?.data?.error || 'Failed to fetch cars');
      setCars([]);
    } finally {
      setCarsLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoadingStates({ ratings: true, recalls: true, complaints: true });
    setErrorStates({ ratings: '', recalls: '', complaints: '' });

    try {
      // Fetch ratings
      try {
        const ratingsData = await carIssuesApi.getCarRatings(selectedCar.id);
        setRatings(Array.isArray(ratingsData) ? ratingsData : []);
      } catch (err) {
        setErrorStates((prev) => ({
          ...prev,
          ratings: err.response?.data?.error || 'Failed to fetch ratings',
        }));
        setRatings([]);
      }

      // Fetch recalls
      try {
        const recallsData = await carIssuesApi.getCarRecalls(selectedCar.id);
        setRecalls(Array.isArray(recallsData) ? recallsData : []);
      } catch (err) {
        setErrorStates((prev) => ({
          ...prev,
          recalls: err.response?.data?.error || 'Failed to fetch recalls',
        }));
        setRecalls([]);
      }

      // Fetch complaints
      try {
        const complaintsData = await carIssuesApi.getCarComplaints(selectedCar.id);
        setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      } catch (err) {
        setErrorStates((prev) => ({
          ...prev,
          complaints: err.response?.data?.error || 'Failed to fetch complaints',
        }));
        setComplaints([]);
      }
    } finally {
      setLoadingStates({ ratings: false, recalls: false, complaints: false });
    }
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  // ===== No Car Selected Page =====
  if (!selectedCar?.id) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Vehicle</h1>
              <p className="text-gray-600">
                Choose a vehicle to view its ratings, recalls, and complaints
              </p>
            </div>

            {/* Cars List */}
            {carsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
              </div>
            ) : carsError ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <p className="text-red-800 font-medium">Failed to load vehicles</p>
                <p className="text-red-600 text-sm mt-1">{carsError}</p>
                <button
                  onClick={fetchAvailableCars}
                  className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-yellow-800 font-medium">No vehicles found</p>
                <p className="text-yellow-700 text-sm mt-2 mb-6">
                  Add a vehicle to view its information
                </p>
                <button
                  onClick={() => navigate('/cars/add')}
                  className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleSelectCar(car)}
                  >
                    {/* Car Image */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                      {car.img ? (
                        <img
                          src={car.img}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Car Info */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Year: {car.year}</p>

                    {/* Select Button */}
                    <button
                      className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectCar(car);
                      }}
                    >
                      Select Vehicle
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ===== Main Issues Page =====
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCar.make} {selectedCar.model}
              </h1>
              <p className="text-sm text-gray-600">Vehicle Reports & Information</p>
            </div>
            <button
              onClick={() => setSelectedCar(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Change Vehicle
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl mb-8">
            <div className="flex border-b border-gray-200">
              {/* Recalls Tab */}
              <button
                onClick={() => setActiveTab('recalls')}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'recalls'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                Recalls
              </button>

              {/* Complaints Tab */}
              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'complaints'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                Complaints
              </button>

              {/* Ratings Tab */}
              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'ratings'
                    ? 'text-yellow-600 border-b-2 border-yellow-600'
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                <Star className="w-5 h-5" />
                Ratings
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'recalls' && (
                <RecallsTab
                  recalls={recalls}
                  isLoading={loadingStates.recalls}
                  error={errorStates.recalls}
                />
              )}

              {activeTab === 'complaints' && (
                <ComplaintsTab
                  complaints={complaints}
                  isLoading={loadingStates.complaints}
                  error={errorStates.complaints}
                />
              )}

              {activeTab === 'ratings' && (
                <RatingsTab
                  ratings={ratings}
                  isLoading={loadingStates.ratings}
                  error={errorStates.ratings}
                />
              )}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              onClick={fetchAllData}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh All Data
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CarIssuesPage;