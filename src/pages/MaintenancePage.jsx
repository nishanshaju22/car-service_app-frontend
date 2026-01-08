import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { maintenanceApi } from '../api/maintainanseApi';
import { carApi } from '../api/carApi';
import StatCard from '../components/StatCard';
import MaintenanceTable from '../components/MaintenanceTable';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelectedCar } from '../context/SelectedCarContext';
import ServicesDueRow from '../components/ServicesDueRow';
import CompleteServiceModal from '../components/CompleteServiceModal';
import UpcomingServicesSection from '../components/UpcomingServicesSection';

const MaintenancePage = () => {
	const navigate = useNavigate();
	const ACCENT = '#2C0703';

	const { selectedCar, setSelectedCar } = useSelectedCar();

	const [maintenance, setMaintenance] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [cars, setCars] = useState([]);
	const [carsLoading, setCarsLoading] = useState(true);
	const [carsError, setCarsError] = useState('');
	const [servicesDue, setServicesDue] = useState({});
	const [modalOpen, setModalOpen] = useState(false);
	const [currentService, setCurrentService] = useState(null);

  // Check if car is selected on mount
	useEffect(() => {
		if (!selectedCar?.id) {
			fetchAvailableCars();
		} else {
			fetchMaintenanceData();
			fetchServices();
		}
	}, [selectedCar?.id]);

	const fetchServices = async () => {
		setLoading(true);
		try {
			const data = await maintenanceApi.findServices(
				selectedCar.id,
				selectedCar.currentMileage
			);
			setServicesDue(data || {});
		} catch (error) {
			setServicesDue({});
		} finally {
			setLoading(false);
		}
	};

	const fetchAvailableCars = async () => {
		setCarsLoading(true);
		setCarsError('');
		try {
			const data = await carApi.getCars();
			setCars(Array.isArray(data) ? data : []);
		} catch (err) {
			setCarsError(err.response?.data?.error || 'Failed to fetch cars');
			setCars([]);
		} finally {
			setCarsLoading(false);
		}
	};

	const fetchMaintenanceData = async () => {
		setLoading(true);
		setError('');
		try {
			const data = await maintenanceApi.getMaintenanceInfo(selectedCar.id);
			setMaintenance(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to fetch maintenance data');
			setMaintenance([]);
		} finally {
			setLoading(false);
		}
	};

  // ----------------------
  // HANDLE SKIP
  // ----------------------
	const handleSkip = async (service, mileage) => {
		try {
			await maintenanceApi.addToMaintenance({
				carId: selectedCar.id,
				servId: service.id,
				mileage: Number(mileage),
				mileageServicedAt: selectedCar.currentMileage,
				cost: 0,
				status: 'SKIPPED',
			});
			// refresh services and maintenance
			await fetchServices();
			await fetchMaintenanceData();
		} catch (error) {
			console.error('Failed to skip service:', error);
		}
	};

  // ----------------------
  // HANDLE COMPLETE
  // ----------------------
	const handleComplete = (service, mileage) => {
		// open modal for entering mileageServicedAt and cost
		setCurrentService({ service, mileage });
		setModalOpen(true);
	};

	const handleConfirmComplete = async (payload) => {
		if (!currentService) return;

		try {
			await maintenanceApi.addToMaintenance({
				carId: selectedCar.id,
				servId: currentService.service.id,
				mileage: Number(payload.mileage),
				mileageServicedAt: payload.mileageServicedAt || null,
				cost: payload.cost || 0,
				status: payload.status,
				scheduledDate: new Date(payload.scheduledAt) || null,
			});

			setModalOpen(false);
			setCurrentService(null);
			await fetchServices();
			await fetchMaintenanceData();
		} catch (error) {
			console.error('Failed to submit service:', error);
		}
	};

	const handleSelectCar = (car) => {
		setSelectedCar(car);
	};

  	// Calculate stats
	const stats = {
		completed: maintenance.filter((m) => m.status === 'COMPLETED').length,
		scheduled: maintenance.filter((m) => m.status === 'SCHEDULED').length,
		overdue: maintenance.filter((m) => m.status === 'OVERDUE').length,
		skipped: maintenance.filter((m) => m.status === 'SKIPPED').length,
	};

  // ----------------------
  // Render No Car Selected Page
  // ----------------------
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
                Choose a vehicle to view its maintenance records
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
                  Add a vehicle to start tracking maintenance
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
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Car Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-500">Year: {car.year}</p>
                      {car.color && (
                        <p className="text-sm text-gray-500">Color: {car.color}</p>
                      )}
                    </div>

                    {/* Car Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Mileage</p>
                        <p className="font-semibold text-gray-900">
                          {car.currentMileage?.toLocaleString() || 0} {car.mileageUnit || 'km'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">License Plate</p>
                        <p className="font-semibold text-gray-900">
                          {car.licensePlate || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Select Button */}
                    <button
                      className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors group-hover:bg-blue-700"
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

  // ----------------------
  // Render Maintenance Page
  // ----------------------
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCar.make} {selectedCar.model}
              </h1>
              <p className="text-gray-600 mt-1">Year: {selectedCar.year}</p>
            </div>
            <button
              onClick={() => setSelectedCar(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Change Vehicle
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Services Due Row */}
            <ServicesDueRow
                services={servicesDue}
                onComplete={handleComplete}
                onSkip={handleSkip}
            />

            {/* Upcoming Services Section */}
            <UpcomingServicesSection
            carId={selectedCar.id}
            currentMileage={selectedCar.currentMileage}
            mileageUnit={selectedCar.mileageUnit}
            />


          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Completed"
              count={stats.completed}
              subtitle={stats.completed === 1 ? '1 completed' : `${stats.completed} completed`}
              icon={CheckCircle}
              accentColor="#10b981"
            />
            <StatCard
              title="Scheduled"
              count={stats.scheduled}
              subtitle={stats.scheduled === 1 ? '1 upcoming' : `${stats.scheduled} upcoming`}
              icon={Clock}
              accentColor="#3b82f6"
            />
            <StatCard
              title="Overdue"
              count={Object.keys(servicesDue).length}
              subtitle={stats.overdue === 1 ? '1 overdue' : `${Object.keys(servicesDue).length} overdue`}
              icon={AlertCircle}
              accentColor="#ef4444"
            />
            <StatCard
              title="Total Services"
              count={maintenance.length}
              subtitle={`${Math.round((stats.completed / Math.max(maintenance.length, 1)) * 100)}% completed`}
              icon={BarChart3}
              accentColor={ACCENT}
            />
          </div>

          {/* Table Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All Maintenance Records
              </h2>
              <button
                onClick={fetchMaintenanceData}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
            <MaintenanceTable
              maintenance={maintenance}
              isLoading={loading}
              error={error}
            />
          </div>

          {/* Charts Section Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Maintenance Trend
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cost Analysis
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chart placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Service Modal */}
        {modalOpen && currentService && (
          <CompleteServiceModal
            service={currentService.service}
            mileage={currentService.mileage}
            onClose={() => setModalOpen(false)}
            onSubmit={handleConfirmComplete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenancePage;
