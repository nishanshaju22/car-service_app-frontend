import { Check, X } from 'lucide-react';

const priorityColors = {
  critical: 'bg-red-500',
  recommended: 'bg-yellow-400',
  optional: 'bg-gray-300'
};

const ServicesDueRow = ({ services, onComplete, onSkip }) => {
  const hasServices = Object.keys(services).length > 0;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Services Due
      </h2>

      {!hasServices ? (
        /* Empty state */
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500">
            No overdue services 🎉
          </p>
        </div>
      ) : (
        /* Cards row */
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: 'none',        // Firefox
            msOverflowStyle: 'none'        // IE / Edge
          }}
        >
          {/* Hide scrollbar for WebKit browsers */}
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <div className="flex gap-4 hide-scrollbar">
            {Object.entries(services).map(([mileage, list]) =>
              list.map((service) => (
                <div
                  key={`${mileage}-${service.id}`}
                  className="min-w-[280px] bg-white border rounded-2xl shadow-sm flex relative overflow-hidden"
                >
                  {/* Priority strip (LEFT) */}
                  <div
                    className={`w-2 ${priorityColors[service.priority]}`}
                  />

                  {/* Card body */}
                  <div className="flex flex-col flex-1">
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Due at {mileage} km
                      </p>

                      <h3 className="font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      <p className="text-xs text-gray-500">
                        Est: ${service.estimatedCost.min} – ${service.estimatedCost.max}
                      </p>
                    </div>

                    {/* Actions pinned to bottom */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-5">
                      {/* Cancel */}
                      <button
                        onClick={() => onSkip(service, mileage)}
                        className="w-full flex items-center justify-center px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        title="Cancel"
                      >
                        Skip
                      </button>

                      {/* Complete */}
                      <button
                        onClick={() => onComplete(service, mileage)}
                        className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Complete"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesDueRow;
