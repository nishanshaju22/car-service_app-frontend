import { useState } from 'react';

const CompleteServiceModal = ({ service, mileage, onClose, onSubmit }) => {
  const [status, setStatus] = useState('COMPLETED'); // default
  const [cost, setCost] = useState('');
  const [mileageAtService, setMileageAtService] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState('');

  const ACCENT = '#2C0703';

  const handleConfirm = () => {
    setError('');

    if (status === 'COMPLETED') {
      if (!cost || isNaN(Number(cost)) || Number(cost) <= 0) {
        setError('Please enter a valid cost.');
        return;
      }
      if (!mileageAtService || isNaN(Number(mileageAtService)) || Number(mileageAtService) <= 0) {
        setError('Please enter valid mileage at service.');
        return;
      }
    } else if (status === 'SCHEDULED') {
      if (!scheduledAt) {
        setError('Please select a date and time.');
        return;
      }
      const scheduledDate = new Date(scheduledAt);
      const now = new Date();
      if (scheduledDate <= now) {
        setError('Scheduled date must be in the future.');
        return;
      }
    }

    // If validation passes, call onSubmit
    const payload = {
      servId: service.id,
      mileage: Number(mileage),
      status,
      cost: status === 'COMPLETED' ? Number(cost) : 0,
      mileageServicedAt: status === 'COMPLETED' ? Number(mileageAtService) : null,
      scheduledAt: status === 'SCHEDULED' ? scheduledAt : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-200">
        {/* Header */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {status === 'COMPLETED' ? 'Complete Service' : 'Schedule Service'}
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          {service.name} @ {mileage} km
        </p>

        <div className="space-y-4">
          {/* Status dropdown */}
          <div className="relative w-full">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C0703] focus:border-[#2C0703] appearance-none"
            >
              <option value="COMPLETED">Completed</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Completed inputs */}
          {status === 'COMPLETED' && (
            <>
              <input
                type="number"
                placeholder="Service Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C0703] focus:border-[#2C0703] shadow-sm placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Mileage at Service"
                value={mileageAtService}
                onChange={(e) => setMileageAtService(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C0703] focus:border-[#2C0703] shadow-sm placeholder-gray-400"
              />
            </>
          )}

          {/* Scheduled input */}
          {status === 'SCHEDULED' && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C0703] focus:border-[#2C0703] shadow-sm text-gray-900"
            />
          )}

          {/* Error message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-[#2C0703] text-white hover:bg-[#3a0a04] transition font-semibold shadow"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteServiceModal;
