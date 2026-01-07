import { useState } from 'react';

const CompleteServiceModal = ({ service, mileage, carId, onClose, onSubmit }) => {
  const [cost, setCost] = useState('');
  const [mileageAtService, setMileageAtService] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Complete Service
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          {service.name} @ {mileage} km
        </p>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Service Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            placeholder="Mileage at Service"
            value={mileageAtService}
            onChange={(e) => setMileageAtService(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                carId,
                servId: service.id,
                mileage,
                mileageAtService,
                cost,
                status: 'COMPLETED'
              })
            }
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteServiceModal;
