import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { maintenanceApi } from '../api/maintainanseApi';
import StatCard from '../components/StatCard';
import MaintenanceTable from '../components/MaintenanceTable';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelectedCar } from '../context/SelectedCarContext';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const ACCENT = '#2C0703';

  const { selectedCar } = useSelectedCar();

  const carId = selectedCar.id;

  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await maintenanceApi.getMaintenanceInfo(carId);
      setMaintenance(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch maintenance data');
      setMaintenance([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    completed: maintenance.filter((m) => m.status === 'COMPLETED').length,
    scheduled: maintenance.filter((m) => m.status === 'SCHEDULED').length,
    overdue: maintenance.filter((m) => m.status === 'OVERDUE').length,
    skipped: maintenance.filter((m) => m.status === 'SKIPPED').length,
  };

  return (
    <DashboardLayout>
        <div className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-8 py-8">
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
                count={stats.overdue}
                subtitle={stats.overdue === 1 ? '1 overdue' : `${stats.overdue} overdue`}
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
        </div>
    </DashboardLayout>
  );
};

export default MaintenancePage;