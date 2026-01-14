import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { carApi } from '../api/carApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelectedCar } from '../context/SelectedCarContext';

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
    if (years > 0) {
      result += `${years} year${years > 1 ? 's' : ''}`;  
    } 

    if (months > 0) {
        result += (years > 0 ? ', ' : '') + `${months} month${months > 1 ? 's' : ''}`;
    }

    return result;
}

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, carId: null, carName: '' });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { selectedCar, setSelectedCar } = useSelectedCar();
    const [serviceColours, setServiceColours] = useState({});
    const [loadingColours, setLoadingColours] = useState(true);
    const [serviceReasons, setServiceReasons] = useState({});
    const [predictorModal, setPredictorModal] = useState({
        show: false,
        carId: null,
    });

    const [predictorForm, setPredictorForm] = useState({
        daysRan: '',
        mileageDiff: '',
    });

    const [predictorError, setPredictorError] = useState('');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setLoadingColours(true);
            const response = await carApi.getCars();
            console.log(response)
            setCars(response.cars || []);
            setServiceColours(response.colours);
            setServiceReasons(response.reasons);
        } catch (err) {
            setError('Failed to load cars');
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingColours(false);
        }
    };

    const handleDeleteClick = (car) => {
        setDeleteModal({
            show: true,
            carId: car.id,
            carName: `${car.make} ${car.model} (${car.year})`,
        });
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            await carApi.deleteCar(deleteModal.carId);
            setCars(cars.filter((c) => c.id !== deleteModal.carId));
            setDeleteModal({ show: false, carId: null, carName: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to delete car');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openPredictorModal = (carId) => {
        setPredictorModal({ show: true, carId });
        setPredictorForm({ daysRan: '', mileageDiff: '' });
        setPredictorError('');
    };

    const closePredictorModal = () => {
        setPredictorModal({ show: false, carId: null });
    };

    const handlePredictorSubmit = () => {
        const days = Number(predictorForm.daysRan);
        const mileage = Number(predictorForm.mileageDiff);

        if (days < 30) {
            setPredictorError('Number of days must be greater than 30.');
            return;
        }

        if (days <= 0 || mileage <= 0) {
            setPredictorError('Please enter valid positive numbers.');
            return;
        }

        // 👉 Placeholder for future API call
        console.log('Mileage predictor added:', {
            carId: predictorModal.carId,
            days,
            mileage,
        });

        closePredictorModal();
    };

    const formatMileage = (mileage, unit) => `${mileage?.toLocaleString() || 0} ${unit || 'km'}`;

    return (
        <DashboardLayout>
            <div className="w-full">
                {/* ===== Title ===== */}
                <div className="px-10 pt-10 pb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Cars Owned</h2>
                </div>

                {/* ===== Gray Cars Section ===== */}
                <section className="relative bg-slate-100 rounded-2xl mx-6 px-10 py-16 min-h-[440px]">
                    {/* ===== Add Car Button (only if cars exist) ===== */}
                    {cars.length > 0 && !loading && (
                        <button
                            onClick={() => navigate('/cars/add')}
                            className="
                                absolute top-6 right-6
                                flex items-center justify-center
                                w-20 h-8
                                rounded-xl
                                text-white
                                bg-gradient-to-r from-indigo-600 to-violet-600
                                hover:from-indigo-700 hover:to-violet-700
                                transition
                                shadow-lg shadow-indigo-600/30
                            "
                            aria-label="Add car"
                        >
                            <span className="text-2xl leading-none">+</span>
                        </button>
                    )}

                    <div className="max-w-7xl w-full">
                        {/* ===== Loading State ===== */}
                        {(loading || loadingColours) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2C0703]" />
                            </div>
                        )}

                        {/* ===== Horizontal list ===== */}
                        {!loading && !loadingColours && (
                            <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-6">
                                {/* ===== Empty State ===== */}
                                {cars.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center w-full">
                                        <p className="text-2xl font-semibold text-slate-800 mb-3">
                                            No cars added yet
                                        </p>

                                        <div className="w-12 h-[2px] bg-[#2C0703] opacity-60 mb-4" />

                                        <p className="text-slate-600 mb-8 max-w-md">
                                            Add your first vehicle to start tracking maintenance, mileage predictions, and service history.
                                        </p>

                                        <button
                                            onClick={() => navigate('/cars/add')}
                                            className="
                                                px-8 py-3
                                                rounded-xl
                                                font-medium
                                                text-white
                                                bg-gradient-to-r from-indigo-600 to-violet-600
                                                hover:from-indigo-700 hover:to-violet-700
                                                transition
                                                shadow-lg shadow-indigo-600/30
                                            "
                                        >
                                            Add a Car
                                        </button>
                                    </div>
                                )}

                                <div className="w-10 flex-shrink-0" />

                                {/* ===== Car Cards ===== */}
                                {cars.map((car) => (
                                    <div
                                        key={car.id}
                                        onClick={() => navigate(`/car/${car.id}`)}
                                        className="
                                            w-[380px]
                                            flex-shrink-0
                                            snap-start
                                            bg-white
                                            rounded-3xl
                                            border border-slate-200
                                            shadow-md hover:shadow-lg transition
                                            last:mr-24
                                            relative
                                            flex flex-col justify-between
                                            cursor-pointer
                                            overflow-hidden
                                        "
                                    >
                                        <div className="group absolute left-0 top-0 h-full w-2 cursor-help">
                                            <div
                                                className={`
                                                    h-full w-full
                                                    bg-${serviceColours?.[car.id] || 'gray'}-500
                                                    transition
                                                    group-hover:brightness-110
                                                    group-hover:shadow-[0_0_8px_rgba(0,0,0,0.25)]
                                                `}
                                            />

                                            <div
                                                className="
                                                    absolute left-4 top-4
                                                    hidden group-hover:block
                                                    bg-black text-white text-xs
                                                    px-2 py-1 rounded-md
                                                    whitespace-nowrap
                                                    z-50
                                                "
                                            >
                                                {serviceReasons[car.id] || "No reason detected"}
                                            </div>
                                        </div>

                                        <div className="p-6">

                                            {/* Top content */}
                                            <div>
                                            {/* Image */}
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                                                <img
                                                src={car.img}
                                                alt="Car"
                                                className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                            </div>

                                            {/* Header with Edit/Delete */}
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {car.make}
                                                </h3>
                                                <h3>{car.model}</h3>
                                                <p className="text-slate-500">({car.year})</p>
                                                </div>

                                                <div className="flex flex-row gap-2 ml-4 mt-2">
                                                {/* Delete */}
                                                <button
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(car);
                                                    }}
                                                    className="
                                                    w-8 h-8
                                                    bg-red-500 hover:bg-red-600
                                                    rounded-xl
                                                    flex items-center justify-center
                                                    transition
                                                    group
                                                    "
                                                    title="Delete car"
                                                >
                                                    <img
                                                    src="src/assets/trash.jpg"
                                                    alt="Delete"
                                                    className="w-5 h-5 group-hover:hidden"
                                                    />
                                                    <img
                                                    src="src/assets/trashOpen.jpg"
                                                    alt="Delete"
                                                    className="w-5 h-5 hidden group-hover:block"
                                                    />
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/cars/edit/${car.id}`);
                                                    }}
                                                    className="
                                                    w-8 h-8
                                                    bg-green-600 hover:bg-green-800
                                                    rounded-xl
                                                    flex items-center justify-center
                                                    transition
                                                    "
                                                    title="Edit car"
                                                >
                                                    <img
                                                    src="src/assets/edit.png"
                                                    alt="Edit"
                                                    className="w-4 h-4"
                                                    />
                                                </button>
                                                </div>
                                            </div>

                                            {/* Accent */}
                                            <div className="w-10 h-[2px] bg-[#2C0703] opacity-50 mb-4" />

                                            {/* Details */}
                                            <div className="grid grid-cols-2 gap-5 text-sm">
                                                <div>
                                                <p className="text-slate-500">Age since purchase</p>
                                                <p className="font-medium text-slate-900">
                                                    {timeSincePurchase(car.purchaseDate)}
                                                </p>
                                                </div>

                                                <div>
                                                <p className="text-slate-500">Next maintenance</p>
                                                <p className="font-medium text-slate-900">
                                                    Feb 15, 2026
                                                </p>
                                                </div>

                                                <div className="col-span-2 flex items-end justify-between">
                                                <div>
                                                    <p className="text-slate-500">Predicted mileage</p>
                                                    <p className="font-medium text-slate-900">
                                                        {formatMileage(car.currentMileage, car.mileageUnit)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPredictorModal(car.id);
                                                    }}
                                                    className="
                                                        px-4 py-2
                                                        rounded-xl
                                                        text-sm font-medium
                                                        bg-slate-900 text-white
                                                        hover:bg-slate-800
                                                        transition
                                                    "
                                                >
                                                    Add Predictor
                                                </button>
                                            </div>
                                            </div>
                                            </div>

                                            {/* Select button */}
                                            <div className="flex justify-center mt-4">
                                            <button
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                selectedCar?.id === car.id
                                                    ? setSelectedCar(null)
                                                    : setSelectedCar(car);
                                                }}
                                                className={`py-2 w-32 rounded-xl font-medium transition
                                                ${
                                                    selectedCar?.id === car.id
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-200 text-slate-800'
                                                }`}
                                            >
                                                {selectedCar?.id === car.id ? 'Selected' : 'Select'}
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== Bottom Section ===== */}
                <section className="bg-white h-[360px] flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Future dashboard content</p>
                </section>

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Delete Vehicle?</h3>
                            <p className="text-slate-600 text-center mb-6">
                                Are you sure you want to delete <strong>{deleteModal.carName}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, carId: null, carName: '' })}
                                    disabled={deleteLoading}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {predictorModal.show && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                                Add Mileage Predictor
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Days Ran
                                    </label>
                                    <input
                                        type="number"
                                        value={predictorForm.daysRan}
                                        onChange={(e) =>
                                            setPredictorForm({
                                                ...predictorForm,
                                                daysRan: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                                        placeholder="Must be greater than 30"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Mileage Difference
                                    </label>
                                    <input
                                        type="number"
                                        value={predictorForm.mileageDiff}
                                        onChange={(e) =>
                                            setPredictorForm({
                                                ...predictorForm,
                                                mileageDiff: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                                        placeholder="e.g. 1200 km"
                                    />
                                </div>

                                {predictorError && (
                                    <p className="text-red-600 text-sm">{predictorError}</p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={closePredictorModal}
                                    className="flex-1 px-4 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePredictorSubmit}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
